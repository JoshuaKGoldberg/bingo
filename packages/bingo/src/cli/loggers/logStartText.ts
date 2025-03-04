import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { ProductionMode } from "../../types/modes.js";

export function logStartText(
	mode: ProductionMode,
	from: string,
	type: string,
	offline: boolean | undefined,
) {
	prompts.log.step(
		[
			`Running with mode --${mode} using the ${type}:`,
			`  ${chalk.green(from)}`,
		].join("\n"),
	);

	if (offline) {
		prompts.log.message(
			"--offline enabled. You'll need to git push any changes manually.",
		);
	}
}
