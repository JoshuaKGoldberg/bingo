import { intakeDirectory } from "bingo-fs";

import { createSystemContextWithAuth } from "../../contexts/createSystemContextWithAuth.js";
import { prepareOptions } from "../../preparation/prepareOptions.js";
import { runTemplate } from "../../runners/runTemplate.js";
import { AnyShape } from "../../types/shapes.js";
import { Template } from "../../types/templates.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { logRerunSuggestion } from "../loggers/logRerunSuggestion.js";
import { logStartText } from "../loggers/logStartText.js";
import { CLIMessage } from "../messages.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForOptionSchemas } from "../prompts/promptForOptionSchemas.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedRepositoryLocator } from "./getForkedRepositoryLocator.js";
import { readConfigSettings } from "./readConfigSettings.js";

export interface RunModeTransitionSettings<
	OptionsShape extends AnyShape,
	Refinements,
> {
	argv: string[];
	configFile: string | undefined;
	directory?: string;
	display: ClackDisplay;
	from: string;
	offline?: boolean;
	template: Template<OptionsShape, Refinements>;
}

export async function runModeTransition<
	OptionsShape extends AnyShape,
	Refinements,
>({
	argv,
	configFile,
	directory = ".",
	display,
	from,
	offline,
	template,
}: RunModeTransitionSettings<OptionsShape, Refinements>): Promise<ModeResults> {
	logStartText("transition", offline);

	const system = await createSystemContextWithAuth({
		directory,
		display,
		offline,
	});

	const repositoryLocator =
		template.about?.repository &&
		(await getForkedRepositoryLocator(directory, template.about.repository));

	if (repositoryLocator) {
		await runSpinnerTask(
			display,
			`Clearing from ${repositoryLocator}`,
			`Cleared from ${repositoryLocator}`,
			async () => {
				await clearTemplateFiles(directory);
				await clearLocalGitTags(system.runner);
			},
		);
	}

	const providedOptions = parseZodArgs(argv, template.options);

	const loadedConfig = await readConfigSettings(
		configFile,
		directory,
		template,
	);
	if (loadedConfig instanceof Error) {
		logRerunSuggestion(argv, providedOptions);
		return { error: loadedConfig, status: CLIStatus.Error };
	}

	const preparedOptions =
		Object.keys(template.options).length &&
		(await runSpinnerTask(
			display,
			"Inferring options from existing repository",
			"Inferred options from existing repository",
			async () => {
				return await prepareOptions(template, {
					...system,
					existing: {
						...loadedConfig?.options,
						...providedOptions,
						directory,
					},
					offline,
				});
			},
		));
	if (preparedOptions instanceof Error) {
		logRerunSuggestion(argv, providedOptions);
		return { status: CLIStatus.Error };
	}

	const baseOptions = await promptForOptionSchemas(template, {
		existing: { ...providedOptions, ...preparedOptions },
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(argv, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const files = await intakeDirectory(directory, {
		exclude: /node_modules|^\.git$/,
	});

	const creation = await runSpinnerTask(
		display,
		`Running ${from}`,
		`Ran ${from}`,
		async () =>
			await runTemplate(template, {
				...system,
				directory,
				files,
				mode: "transition",
				offline,
				options: baseOptions.completed,
				refinements: loadedConfig?.refinements,
			}),
	);
	if (creation instanceof Error) {
		logRerunSuggestion(argv, baseOptions.prompted);
		return {
			outro: CLIMessage.Leaving,
			status: CLIStatus.Error,
		};
	}

	if (!repositoryLocator) {
		logRerunSuggestion(argv, baseOptions.prompted);
		return {
			outro: CLIMessage.Done,
			status: CLIStatus.Success,
		};
	}

	const commit = await runSpinnerTask(
		display,
		"Creating initial commit",
		"Created initial commit",
		async () => {
			await createInitialCommit(system.runner, {
				amend: true,
				push: !offline,
			});
		},
	);

	logRerunSuggestion(argv, baseOptions.prompted);

	return commit instanceof Error
		? {
				outro: CLIMessage.Leaving,
				status: CLIStatus.Error,
			}
		: {
				outro: CLIMessage.New,
				status: CLIStatus.Success,
			};
}
