import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { parseArgs } from "node:util";
import { z } from "zod";

import { packageData } from "../packageData.js";
import { createClackDisplay } from "./display/createClackDisplay.js";
import { findPositionalFrom } from "./findPositionalFrom.js";
import { logOutro } from "./loggers/logOutro.js";
import { CLIMessage } from "./messages.js";
import { readProductionSettings } from "./readProductionSettings.js";
import { runModeSetup } from "./setup/runModeSetup.js";
import { CLIStatus } from "./status.js";
import { runModeTransition } from "./transition/runModeTransition.js";

const valuesSchema = z.object({
	directory: z.string().optional(),
	from: z.string().optional(),
	help: z.boolean().optional(),
	mode: z.union([z.literal("setup"), z.literal("transition")]).optional(),
	offline: z.boolean().optional(),
	owner: z.string().optional(),
	repository: z.string().optional(),
	yes: z.boolean().optional(),
});

export async function runCli(args: string[]) {
	const { positionals, values } = parseArgs({
		args,
		options: {
			directory: {
				type: "string",
			},
			from: {
				type: "string",
			},
			help: {
				type: "boolean",
			},
			mode: {
				type: "string",
			},
			offline: {
				type: "boolean",
			},
			owner: {
				type: "string",
			},
			repository: {
				type: "string",
			},
			version: {
				type: "boolean",
			},
			yes: {
				type: "boolean",
			},
		},
		strict: false,
	});

	if (values.version) {
		console.log(packageData.version);
		return CLIStatus.Success;
	}

	prompts.intro(
		[
			chalk.blueBright(`✨ `),
			chalk.blue("Welcome to "),
			chalk.bgGreenBright.black("Bingo"),
			chalk.blue(": a delightful repository templating engine."),
			chalk.blueBright(` ✨`),
		].join(""),
	);

	prompts.log.message(
		[
			"Learn more about Bingo on:",
			`  ${chalk.green("https://")}${chalk.green.bold("create.bingo")}`,
		].join("\n"),
	);

	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings(validatedValues);
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}

	const display = createClackDisplay();
	const sharedSettings = {
		...validatedValues,
		args,
		display,
		from: validatedValues.from ?? findPositionalFrom(positionals),
	};

	const results =
		productionSettings.mode === "setup"
			? await runModeSetup(sharedSettings)
			: await runModeTransition({
					...sharedSettings,
					configFile: productionSettings.configFile,
				});

	if (results.status === CLIStatus.Error) {
		prompts.log.error(chalk.red(`Error: ${results.error.message}`));
	}

	logOutro(
		results.outro ?? chalk.yellow(`Operation cancelled. ${CLIMessage.Exiting}`),
		{ items: display.dumpItems(), suggestions: results.suggestions },
	);

	return results.status;
}
