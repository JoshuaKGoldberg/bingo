import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { TransitionSource } from "../transition/parseTransitionSource.js";
import { logHelpText } from "./logHelpText.js";

export async function logTransitionHelpText(source: Error | TransitionSource) {
	logHelpText("transition", source);

	if (source instanceof Error) {
		return { outro: CLIMessage.Exiting, status: CLIStatus.Error };
	}

	const spinner = prompts.spinner();
	spinner.start(`Loading ${source.descriptor}`);

	const loaded = await source.load();

	if (loaded instanceof Error) {
		spinner.stop(
			`Could not load ${chalk.blue(source.descriptor)}: ${chalk.red(loaded.message)}`,
			1,
		);
		return { outro: CLIMessage.Exiting, status: CLIStatus.Error };
	}

	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	spinner.stop(`Loaded ${chalk.blue(source.descriptor)}`);

	return { outro: CLIMessage.Ok, status: CLIStatus.Success };
}
