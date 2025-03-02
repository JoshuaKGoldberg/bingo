import { intake } from "bingo-fs";

import { executeTemplatesRecursive } from "./executeTemplatesRecursive.js";

export async function handlebars(sourcePath: string, options?: object) {
	const source = await intake(sourcePath);

	if (!source) {
		throw new Error(
			`handlebars() must be given a path to a file or directory. '${sourcePath}' does not exist.`,
		);
	}

	return executeTemplatesRecursive(source, options);
}
