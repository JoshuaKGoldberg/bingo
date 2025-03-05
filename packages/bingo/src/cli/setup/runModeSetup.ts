import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { createSystemContextWithAuth } from "../../contexts/createSystemContextWithAuth.js";
import { prepareOptions } from "../../preparation/prepareOptions.js";
import { runTemplate } from "../../runners/runTemplate.js";
import { AnyShape } from "../../types/shapes.js";
import { Template } from "../../types/templates.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { logHelpText } from "../loggers/logHelpText.js";
import { logRerunSuggestion } from "../loggers/logRerunSuggestion.js";
import { logStartText } from "../loggers/logStartText.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForDirectory } from "../prompts/promptForDirectory.js";
import { promptForOptionSchemas } from "../prompts/promptForOptionSchemas.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { makeRelative } from "../utils.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";
import { getRepositoryLocator } from "./getRepositoryLocator.js";

export interface RunModeSetupSettings<
	OptionsShape extends AnyShape,
	Refinements,
> {
	args: string[];
	directory?: string;
	display: ClackDisplay;
	from: string;
	help?: boolean;
	offline?: boolean;
	owner?: string;
	repository?: string;
	template: Template<OptionsShape, Refinements>;
}

export async function runModeSetup<OptionsShape extends AnyShape, Refinements>({
	args,
	repository,
	directory: requestedDirectory = repository,
	display,
	from,
	help,
	offline,
	template,
}: RunModeSetupSettings<OptionsShape, Refinements>): Promise<ModeResults> {
	if (help) {
		return logHelpText("setup", from, template);
	}

	logStartText("setup", from, "template", offline);

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
		display,
		offline,
	});

	const providedOptions = parseZodArgs(args, template.options);
	const preparedOptions = await prepareOptions(template, {
		...system,
		existing: { ...providedOptions, directory },
		offline,
	});

	const baseOptions = await promptForOptionSchemas(template, {
		existing: {
			directory,
			repository: repository ?? directory,
			...providedOptions,
			...preparedOptions,
		},
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
		outro: `Thanks for using ${chalk.bgGreenBright.black(from)}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
