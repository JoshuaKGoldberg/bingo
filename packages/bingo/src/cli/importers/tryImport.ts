import * as prompts from "@clack/prompts";
import chalk from "chalk";
import path from "node:path";

import { tryCatchError } from "../../utils/tryCatch.js";

export async function tryImport(from: string): Promise<Error | object> {
	const spinner = prompts.spinner();

	spinner.start(`Importing ${chalk.blue(from)}`);
	const imported = await tryCatchError(
		import(path.join(process.cwd(), from)) as Promise<object>,
	);

	if (imported instanceof Error) {
		spinner.stop(`Could not import ${chalk.blue(from)}. Does it exist?`, 1);
	} else {
		spinner.stop(`Imported ${chalk.blue(from)}.`);
	}

	return imported;
}
