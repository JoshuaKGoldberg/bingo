import { execa, parseCommandString } from "execa";

import { SystemRunner } from "./runner.js";

export function createSystemRunner(directory = "."): SystemRunner {
	const executor = execa({ cwd: directory, reject: false });

	return (command: string) => executor`${parseCommandString(command)}`;
}
