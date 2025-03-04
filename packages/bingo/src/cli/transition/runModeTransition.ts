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
import { promptForOptionSchemas } from "../prompts/promptForOptionSchemas.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedRepositoryLocator } from "./getForkedRepositoryLocator.js";

export interface RunModeTransitionSettings<OptionsShape extends AnyShape> {
	args: string[];
	configFile: string | undefined;
	directory?: string;
	display: ClackDisplay;
	from: string;
	help?: boolean;
	offline?: boolean;
	template: Template<OptionsShape>;
}

export async function runModeTransition<OptionsShape extends AnyShape>({
	args,
	configFile,
	directory = ".",
	display,
	from,
	help,
	offline,
	template,
}: RunModeTransitionSettings<OptionsShape>): Promise<ModeResults> {
	if (help) {
		return logHelpText("transition", from, template);
	}

	const transitionType = configFile ? "config file" : "template";

	logStartText("transition", from, transitionType, offline);

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

	const providedOptions = parseZodArgs(args, template.options);
	const existingOptions = await runSpinnerTask(
		display,
		"Inferring options from existing repository",
		"Inferred options from existing repository",
		async () => {
			return await prepareOptions(template, {
				...system,
				existing: { ...providedOptions, directory },
				offline,
			});
		},
	);
	if (existingOptions instanceof Error) {
		logRerunSuggestion(args, providedOptions);
		return { error: existingOptions, status: CLIStatus.Error };
	}

	const baseOptions = await promptForOptionSchemas(template, {
		existing: existingOptions,
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(args, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const creation = await runSpinnerTask(
		display,
		`Running ${from}`,
		`Ran ${from}`,
		async () =>
			await runTemplate(template, {
				...system,
				directory,
				mode: "transition",
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

	if (repositoryLocator) {
		await runSpinnerTask(
			display,
			"Creating initial commit",
			"Created initial commit",
			async () => {
				await createInitialCommit(system.runner, { amend: true, offline });
			},
		);

		logRerunSuggestion(args, baseOptions.prompted);
		return {
			outro: `Done. Enjoy your new repository! 💝`,
			status: CLIStatus.Success,
		};
	}

	logRerunSuggestion(args, baseOptions.prompted);
	return {
		outro: `Done. Enjoy your updated repository! 💝`,
		status: CLIStatus.Success,
	};
}
