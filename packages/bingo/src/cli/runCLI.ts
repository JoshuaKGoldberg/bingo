import chalk from "chalk";
import { z } from "zod";

import { AnyShape } from "../types/shapes.js";
import { Template } from "../types/templates.js";
import { ClackDisplay } from "./display/createClackDisplay.js";
import { logHelpText } from "./loggers/logHelpText.js";
import { logOutro } from "./loggers/logOutro.js";
import { RunCLIRawValues } from "./parseProcessArgv.js";
import { readProductionSettings } from "./readProductionSettings.js";
import { runModeSetup } from "./setup/runModeSetup.js";
import { CLIStatus } from "./status.js";
import { runModeTransition } from "./transition/runModeTransition.js";

const valuesSchema = z.object({
	directory: z.string().optional(),
	help: z.boolean().optional(),
	mode: z.union([z.literal("setup"), z.literal("transition")]).optional(),
	offline: z.boolean().optional(),
	owner: z.string().optional(),
	repository: z.string().optional(),
});

export interface RunCLISettings<OptionsShape extends AnyShape, Refinements> {
	argv: string[];
	display: ClackDisplay;
	from: string;
	template: Template<OptionsShape, Refinements>;
	values: RunCLIRawValues;
}

export async function runCLI<OptionsShape extends AnyShape, Refinements>({
	argv,
	display,
	from,
	template,
	values,
}: RunCLISettings<OptionsShape, Refinements>) {
	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings({
		from,
		...validatedValues,
	});
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}
	if (validatedValues.help) {
		return logHelpText(productionSettings.mode, from, template);
	}

	const sharedSettings = {
		...validatedValues,
		argv,
		display,
		from,
		template,
	};

	return productionSettings.mode === "setup"
		? await runModeSetup(sharedSettings)
		: await runModeTransition({
				...sharedSettings,
				configFile: productionSettings.configFile,
			});
}
