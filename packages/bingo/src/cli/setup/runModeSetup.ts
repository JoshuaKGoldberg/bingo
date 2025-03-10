import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { z } from "zod";

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
import { CLIMessage } from "../messages.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForDirectory } from "../prompts/promptForDirectory.js";
import { promptForOptionSchemas } from "../prompts/promptForOptionSchemas.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { makeRelative } from "../utils.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";

export interface RunModeSetupSettings<
	OptionsShape extends AnyShape,
	Refinements,
> {
	argv: string[];
	directory?: string;
	display: ClackDisplay;
	from: string;
	help?: boolean;
	offline?: boolean;
	repository?: string;
	template: Template<OptionsShape, Refinements>;
}

export async function runModeSetup<OptionsShape extends AnyShape, Refinements>({
	argv,
	display,
	from,
	help,
	offline,
	template,

	// TODO: File or find an issue on eslint-plugin-perfectionist?
	/* eslint-disable perfectionist/sort-objects */
	repository: requestedRepository,
	directory: requestedDirectory = requestedRepository,
	/* eslint-enable perfectionist/sort-objects */
}: RunModeSetupSettings<OptionsShape, Refinements>): Promise<ModeResults> {
	if (help) {
		return logHelpText("setup", from, template);
	}

	logStartText("setup", from, "template", offline);

	const directory = await promptForDirectory({
		requestedDirectory,
		requestedRepository,
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

	const providedOptions = parseZodArgs(argv, {
		directory: z.string().optional(),
		owner: z.string().optional(),
		repository: z.string().optional(),
		...template.options,
	});

	const preparedOptions = await runSpinnerTask(
		display,
		"Inferring default options from system",
		"Inferred default options from system",
		async () => {
			return await prepareOptions(template, {
				...system,
				existing: { ...providedOptions, directory },
				offline,
			});
		},
	);
	if (preparedOptions instanceof Error) {
		logRerunSuggestion(argv, providedOptions);
		return { status: CLIStatus.Error };
	}

	const repository = requestedRepository ?? directory;
	const baseOptions = await promptForOptionSchemas(template, {
		existing: {
			directory,
			repository,
			...providedOptions,
			...preparedOptions,
		},
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(argv, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const remote = offline
		? undefined
		: await createRepositoryOnGitHub(
				display,
				{ repository, ...baseOptions.completed },
				system.fetchers.octokit,
				system.runner,
				template.about?.repository,
			);

	if (remote instanceof Error) {
		logRerunSuggestion(argv, baseOptions.completed);
		return { error: remote, status: CLIStatus.Error };
	}

	if (!offline && !remote) {
		prompts.log.warn(
			"Running in local-only mode without a repository on GitHub",
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
		logRerunSuggestion(argv, baseOptions.prompted);
		return {
			outro: CLIMessage.Leaving,
			status: CLIStatus.Error,
		};
	}

	const prepared = await runSpinnerTask(
		display,
		"Preparing local repository",
		"Prepared local repository",
		async () => {
			await createTrackingBranches(remote, system.runner);
			await createInitialCommit(system.runner, { push: !!remote });
			await clearLocalGitTags(system.runner);
		},
	);

	logRerunSuggestion(argv, baseOptions.prompted);

	if (!prepared) {
		prompts.log.message(
			[
				"Great, you've got a new repository ready to use in:",
				`  ${chalk.green(makeRelative(directory))}`,
				...(remote
					? [
							"",
							"It's also pushed to GitHub on:",
							`  ${chalk.green(`https://github.com/${remote.owner}/${remote.repository}`)}`,
						]
					: []),
			].join("\n"),
		);
		return {
			outro: CLIMessage.Leaving,
			status: CLIStatus.Error,
		};
	}

	return {
		outro: `Thanks for using ${chalk.bgGreenBright.black(from)}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
