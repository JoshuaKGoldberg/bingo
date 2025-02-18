import * as prompts from "@clack/prompts";

import { createSystemContextWithAuth } from "../../contexts/createSystemContextWithAuth.js";
import { runTemplate } from "../../runners/runTemplate.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { logRerunSuggestion } from "../loggers/logRerunSuggestion.js";
import { logStartText } from "../loggers/logStartText.js";
import { logTransitionHelpText } from "../loggers/logTransitionHelpText.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForOptions } from "../prompts/promptForOptions.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedRepositoryLocator } from "./getForkedRepositoryLocator.js";
import { parseTransitionSource } from "./parseTransitionSource.js";

export interface RunModeTransitionSettings {
	args: string[];
	configFile: string | undefined;
	directory?: string;
	display: ClackDisplay;
	from?: string;
	help?: boolean;
	offline?: boolean;
	yes?: boolean;
}

export async function runModeTransition({
	args,
	configFile,
	directory = ".",
	display,
	from,
	help,
	offline,
	yes,
}: RunModeTransitionSettings): Promise<ModeResults> {
	const source = parseTransitionSource({
		configFile,
		directory,
		from,
		yes,
	});

	if (help) {
		return await logTransitionHelpText(source);
	}

	if (source instanceof Error) {
		return {
			error: source,
			outro: source.message,
			status: CLIStatus.Error,
		};
	}

	logStartText("transition", source.descriptor, source.type, offline);

	const template = await source.load();
	if (template instanceof Error) {
		return {
			error: template,
			outro: template.message,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(template)) {
		return { status: CLIStatus.Cancelled };
	}

	const system = await createSystemContextWithAuth({
		directory,
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

	const baseOptions = await promptForOptions(template, {
		existing: {
			...parseZodArgs(args, template.options),
		},
		offline,
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(args, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const descriptor = template.about?.name ?? from ?? "";

	const creation = await runSpinnerTask(
		display,
		`Running the${descriptor} template`,
		`Ran the${descriptor} template`,
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
