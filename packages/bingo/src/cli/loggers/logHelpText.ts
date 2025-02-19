import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { logHelpOptions } from "./logHelpOptions.js";

export function logHelpText(mode: string, packageName: string) {
	prompts.log.info(
		[
			"Running ",
			chalk.green(`--help`),
			" for ",
			chalk.green(`--mode ${mode}`),
			".",
		].join(""),
	);

	logHelpOptions("Common Template", packageName, [
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
}
