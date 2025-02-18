import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { createSystemContextWithAuth } from "../../contexts/createSystemContextWithAuth.js";
import { runTemplate } from "../../runners/runTemplate.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { tryImportTemplate } from "../importers/tryImportTemplate.js";
import { logRerunSuggestion } from "../loggers/logRerunSuggestion.js";
import { logSetupHelpText } from "../loggers/logSetupHelpText.js";
import { logStartText } from "../loggers/logStartText.js";
import { CLIMessage } from "../messages.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForDirectory } from "../prompts/promptForDirectory.js";
import { promptForOptions } from "../prompts/promptForOptions.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { makeRelative } from "../utils.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";
import { getRepositoryLocator } from "./getRepositoryLocator.js";

export interface RunModeSetupSettings {
	args: string[];
	directory?: string;
	display: ClackDisplay;
	from?: string;
	help?: boolean;
	offline?: boolean;
	owner?: string;
	repository?: string;
	yes?: boolean;
}

export async function runModeSetup({
	args,
	repository,
	directory: requestedDirectory = repository,
	display,
	from,
	help,
	offline,
	yes,
}: RunModeSetupSettings): Promise<ModeResults> {
	if (!from || help) {
		return await logSetupHelpText(from, { help, yes });
	}

	logStartText("setup", from, "template", offline);

	const template = await tryImportTemplate(from, yes);
	if (template instanceof Error) {
		return {
			error: template,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(template)) {
		return { status: CLIStatus.Cancelled };
	}

	const directory = await promptForDirectory({
		requestedDirectory,
		requestedRepository: repository,
		template,
	});
	if (prompts.isCancel(directory)) {
		return { status: CLIStatus.Cancelled };
	}

	const system = await createSystemContextWithAuth({
		directory,
		offline,
	});

	const baseOptions = await promptForOptions(template, {
		existing: {
			directory,
			repository: repository ?? directory,
			...parseZodArgs(args, template.options),
		},
		offline,
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(args, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const locator = getRepositoryLocator(baseOptions.completed);

	if (!offline) {
		await runSpinnerTask(
			display,
			"Creating repository on GitHub",
			"Created repository on GitHub",
			async () => {
				await createRepositoryOnGitHub(
					locator,
					system.fetchers.octokit,
					template.about?.repository,
				);
			},
		);
	}

	const descriptor = template.about?.name ?? from;

	const creation = await runSpinnerTask(
		display,
		`Running the ${descriptor} template`,
		`Ran the ${descriptor} template`,
		async () =>
			await runTemplate(template, {
				...system,
				directory,
				mode: "setup",
				offline,
				options: baseOptions.completed,
			}),
	);
	if (creation instanceof Error) {
		logRerunSuggestion(args, baseOptions.prompted);
		return {
			error: creation,
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		};
	}

	await runSpinnerTask(
		display,
		"Preparing local repository",
		"Prepared local repository",
		async () => {
			await createTrackingBranches(locator, system.runner);
			await createInitialCommit(system.runner, { offline });
			await clearLocalGitTags(system.runner);
		},
	);

	logRerunSuggestion(args, baseOptions.prompted);
	prompts.log.message(
		[
			"Great, you've got a new repository ready to use in:",
			`  ${chalk.green(makeRelative(directory))}`,
			...(offline
				? []
				: [
						"",
						"It's also pushed to GitHub on:",
						`  ${chalk.green(`https://github.com/${locator.owner}/${locator.repository}`)}`,
					]),
		].join("\n"),
	);

	return {
		outro: `Thanks for using ${chalk.bgGreenBright.black("bingo")}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
