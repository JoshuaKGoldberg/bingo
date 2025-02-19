import chalk from "chalk";
import path from "node:path";

import { tryImportConfigTemplate } from "../../config/tryImportConfigTemplate.js";
import { Template } from "../../types/templates.js";
import { tryImportTemplate } from "../importers/tryImportTemplate.js";

export interface RequestedTransitionSource {
	configFile?: string;
	directory: string;
	from?: string;
}

export interface TransitionSource {
	descriptor: string;
	load: () => Promise<Error | symbol | Template>;
	type: "config file" | "template";
}

export function parseTransitionSource({
	configFile,
	directory,
	from,
}: RequestedTransitionSource): Error | TransitionSource {
	if (configFile && from) {
		return new Error(
			`${chalk.green("--mode transition")} cannot combine an existing config file (${chalk.blue(configFile)}) with an explicit ${chalk.blue("--from")} (${chalk.blue(from)}).`,
		);
	}

	if (configFile) {
		const absolutePath = path.join(process.cwd(), directory, configFile);
		return {
			descriptor: path.relative(process.cwd(), absolutePath),
			load: async () => await tryImportConfigTemplate(absolutePath),
			type: "config file",
		};
	}

	if (from) {
		return {
			descriptor: from,
			load: async () => await tryImportTemplate(from),
			type: "template",
		};
	}

	return new Error(
		`Existing repository detected. To transition an existing repository, either create a create-example.config file or provide the name or path of a template.`,
	);
}
