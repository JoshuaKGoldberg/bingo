import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { logOutro } from "../loggers/logOutro.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { ClackDisplay, createClackDisplay } from "./createClackDisplay.js";

export interface DisplayPackageData {
	name: string;
	version: string;
}

export async function runInsideClackDisplay(
	{ name, version }: DisplayPackageData,
	runner: (display: ClackDisplay) => Promise<CLIStatus | ModeResults>,
) {
	const display = createClackDisplay();

	prompts.intro(
		[
			chalk.blueBright(`✨ `),
			chalk.bgGreenBright.black(name),
			chalk.blue(`@${version}`),
			chalk.blueBright(` ✨`),
		].join(""),
	);

	const results = await runner(display);

	if (typeof results === "number") {
		return results;
	}

	if (results.status === CLIStatus.Error) {
		prompts.log.error(chalk.red(`Error: ${results.error.message}`));
	}

	logOutro(
		results.outro ?? chalk.yellow(`Operation cancelled. ${CLIMessage.Exiting}`),
		{ items: display.dumpItems(), suggestions: results.suggestions },
	);

	return results.status;
}
