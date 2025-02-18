import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { tryCatchError } from "../../utils/tryCatch.js";
import { ClackDisplay } from "./createClackDisplay.js";

export async function runSpinnerTask<T>(
	display: ClackDisplay,
	start: string,
	stop: string,
	task: () => Promise<T>,
) {
	display.spinner.start(`${start}...`);

	const result = await tryCatchError(task());

	if (result instanceof Error) {
		display.spinner.stop(
			`Error ${start[0].toLowerCase()}${start.slice(1)}:`,
			1,
		);
		prompts.log.error(chalk.red(result.stack));
	} else {
		display.spinner.stop(stop);
	}

	return result;
}
