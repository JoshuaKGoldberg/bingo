import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { ClackSpinner } from "../display/createClackDisplay.js";

export function createNpxInstallationConfirm(
	from: string,
	spinner: ClackSpinner,
	yes: boolean | undefined,
) {
	return async () => {
		if (yes) {
			spinner.stop(
				`${chalk.blue(from)} not found locally and ${chalk.blue("--yes")} specified. ${from} will be fetched with npx. `,
			);
			spinner.start(`Loading ${chalk.blue(from)}`);
			return undefined;
		}

		spinner.stop(
			`${chalk.blue(from)} not found locally and ${chalk.blue("--yes")} not specified. ${from} will need to be fetched with npx. `,
		);

		const allowed = await prompts.confirm({
			message: `Ok to proceed?`,
		});

		if (allowed !== true) {
			return new Error("Installation cancelled.");
		}

		spinner.start(`Loading ${chalk.blue(from)}`);
	};
}
