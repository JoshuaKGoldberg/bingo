import * as prompts from "@clack/prompts";

import { packageData } from "../packageData.js";
import { runInsideClackDisplay } from "./display/runInsideClackDisplay.js";
import { tryImportTemplate } from "./importers/tryImportTemplate.js";
import { logHelpOptions } from "./loggers/logHelpOptions.js";
import { parseProcessArgv } from "./parseProcessArgv.js";
import { runCLI } from "./runCLI.js";
import { CLIStatus } from "./status.js";
import { makeRelative } from "./utils.js";

export async function runBingoCLI() {
	const { args, positionals, values } = parseProcessArgv();
	if (values.version) {
		console.log(packageData.version);
		return CLIStatus.Success;
	}

	return await runInsideClackDisplay(packageData, async (display) => {
		const from = positionals.find((positional) => !positional.startsWith("-"));
		if (!from) {
			prompts.log.error("bingo requires a path to local template file.");
			return CLIStatus.Error;
		}

		const template = await tryImportTemplate(makeRelative(from));
		if (template instanceof Error) {
			console.error(template);
			return CLIStatus.Error;
		}

		const result = await runCLI({
			args,
			display,
			from: `bingo ${from}`,
			template,
			values,
		});

		if (values.help) {
			logHelpOptions("Bingo Development", "bingo", [
				{
					examples: ["template.js", "./path/to/template/index.js"],
					flag: "<from>",
					text: "Local file to run as a template",
					type: "string",
				},
			]);
		}

		return result;
	});
}
