import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { TransitionSource } from "../transition/parseTransitionSource.js";
import { ModeResults } from "../types.js";
import { logHelpText } from "./logHelpText.js";

export async function logTransitionHelpText(
	source: Error | TransitionSource,
): Promise<ModeResults> {
	logHelpText("transition", source);

	if (source instanceof Error) {
		return {
			error: source,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		};
	}

	const spinner = prompts.spinner();
	spinner.start(`Loading ${source.descriptor}`);

	const loaded = await source.load();

	if (loaded instanceof Error) {
		spinner.stop(`Could not load ${chalk.blue(source.descriptor)}.`, 1);
		return {
			error: loaded,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		};
	}

	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	spinner.stop(`Loaded ${chalk.blue(source.descriptor)}`);

	return { outro: CLIMessage.Ok, status: CLIStatus.Success };
}
