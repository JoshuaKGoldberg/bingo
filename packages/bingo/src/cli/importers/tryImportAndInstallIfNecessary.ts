import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { importLocalOrNpx } from "import-local-or-npx";

import { isLocalPath } from "../utils.js";
import { createNpxInstallationConfirm } from "./createNpxInstallationConfirm.js";

export async function tryImportAndInstallIfNecessary(
	from: string,
	yes: boolean | undefined,
): Promise<Error | object> {
	const spinner = prompts.spinner();

	spinner.start(`Loading ${chalk.blue(from)}`);

	const imported = await importLocalOrNpx(from, {
		confirm: createNpxInstallationConfirm(from, spinner, yes),

		// We ignore logs because we don't want to clutter CLI output
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		logger: () => {},
	});

	if (imported.kind === "failure") {
		const template = isLocalPath(from) ? imported.local : imported.npx;
		spinner.stop(
			`Could not load ${chalk.blue(from)}: ${chalk.red(template.message)}`,
			1,
		);
		return template;
	}

	spinner.stop(`Loaded ${chalk.blue(from)}`);

	return imported.resolved;
}
