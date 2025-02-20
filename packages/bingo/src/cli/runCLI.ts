import chalk from "chalk";
import { z } from "zod";

import { AnyShape } from "../options.js";
import { Template } from "../types/templates.js";
import { ClackDisplay } from "./display/createClackDisplay.js";
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

export interface RunCLISettings<OptionsShape extends AnyShape = AnyShape> {
	args: string[];
	display: ClackDisplay;
	from: string;
	template: Template<OptionsShape>;
	values: RunCLIRawValues;
}

export async function runCLI<OptionsShape extends AnyShape = AnyShape>({
	args,
	display,
	from,
	template,
	values,
}: RunCLISettings<OptionsShape>) {
	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings({
		from,
		...validatedValues,
	});
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}

	const sharedSettings = {
		...validatedValues,
		args,
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
