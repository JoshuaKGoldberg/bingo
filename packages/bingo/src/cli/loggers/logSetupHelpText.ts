import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { tryImportTemplate } from "../importers/tryImportTemplate.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { logHelpText } from "./logHelpText.js";
import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

export interface SetupHelpTextOptions {
	help: boolean | undefined;
	yes: boolean | undefined;
}

export async function logSetupHelpText(
	from: string | undefined,
	{ help, yes }: SetupHelpTextOptions,
): Promise<ModeResults> {
	if (!from) {
		if (help) {
			logHelpText("setup");
		} else {
			prompts.log.message(
				[
					`Try it out with:`,
					`  ${chalk.green("npx bingo typescript-app@beta")}`,
				].join("\n"),
			);
		}

		return {
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		};
	}

	logHelpText("setup", {
		descriptor: from,
		type: "template",
	});

	prompts.log.info(`Loading ${chalk.blue(from)} to display its options...`);

	const template = await tryImportTemplate(from, yes);
	if (template instanceof Error) {
		return {
			error: template,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		};
	}

	logSchemasHelpOptions(from, template.options);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
