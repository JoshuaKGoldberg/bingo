import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForInitializationDirectory } from "../prompts/promptForInitializationDirectory.js";
import { promptForPresetOptions } from "../prompts/promptForPresetOptions.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";

export interface RunModeInitializeSettings {
	args: string[];
	directory?: string;
	from?: string;
	preset?: string;
}

export async function runModeInitialize({
	args,
	directory: requestedDirectory,
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeInitializeSettings): Promise<ModeResults> {
	if (!from) {
		return {
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		};
	}

	const loaded = await tryImportTemplatePreset(from, requestedPreset);
	if (loaded instanceof Error) {
		return {
			outro: loaded.message,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(loaded)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const directory = await promptForInitializationDirectory(
		requestedDirectory,
		loaded.template,
	);
	if (prompts.isCancel(directory)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const display = createClackDisplay();
	const system = await createSystemContextWithAuth({ directory, display });

	const options = await promptForPresetOptions({
		base: loaded.preset.base,
		existingOptions: {
			repository: directory,
			...parseZodArgs(args, loaded.preset.base.options),
		},
		system,
	});

	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	display.spinner.start("Creating repository...");

	const creation = await runPreset(loaded.preset, {
		...system,
		directory,
		mode: "initialize",
		options,
	});

	display.spinner.stop("Created repository");

	return {
		outro: [
			chalk.blue("Your new repository is ready in:"),
			chalk.green(directory.startsWith(".") ? directory : `./${directory}`),
		].join(" "),
		status: CLIStatus.Error,
		suggestions: creation.suggestions,
	};
}
