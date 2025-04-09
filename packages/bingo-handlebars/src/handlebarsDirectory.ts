import { intake, isFile } from "bingo-fs";

import { executeTemplatesRecursive } from "./executeTemplatesRecursive.js";

export async function handlebarsDirectory(
	sourcePath: string,
	options?: object,
) {
	const source = await intake(sourcePath);

	if (!source) {
		throw new Error(
			`handlebarsDirectory() must be given a path to a directory. '${sourcePath}' does not exist.`,
		);
	}

	if (isFile(source)) {
		throw new Error(
			`handlebarsDirectory() must be given a path to a directory. '${sourcePath}' is a file.`,
		);
	}

	return executeTemplatesRecursive(source, options);
}
