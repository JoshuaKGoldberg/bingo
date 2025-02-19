import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { AnyShape } from "../../options.js";
import { Template } from "../../types/templates.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { logHelpOptions } from "./logHelpOptions.js";
import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

export function logHelpText<OptionsShape extends AnyShape = AnyShape>(
	mode: string,
	from: string,
	template: Template<OptionsShape>,
): ModeResults {
	const packageName = template.about?.name ?? from;

	prompts.log.info(
		[
			"Running ",
			chalk.green(`--help`),
			" for ",
			chalk.green(`--mode ${mode}`),
			".",
		].join(""),
	);

	logHelpOptions("Bingo template", from, [
		{
			examples: ["--directory my-fancy-project"],
			flag: "--directory",
			text: "What local directory path to run under",
			type: "string",
		},
		{
			examples: ["--help"],
			flag: "--help",
			text: "Prints help text.",
			type: "string",
		},
		{
			examples: ["--mode setup", "--mode transition"],
			flag: "--mode",
			text: "Which mode to run in.",
			type: '"setup" | "transition"',
		},
		{
			examples: ["--offline"],
			flag: "--offline",
			text: 'Whether to run in an "offline" mode that skips network requests.',
			type: "boolean",
		},
		{
			examples: ["--version"],
			flag: "--version",
			text: "Prints package versions.",
			type: "boolean",
		},
	]);

	logSchemasHelpOptions(packageName, template.options);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
