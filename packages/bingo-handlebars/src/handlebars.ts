import { intake } from "bingo-fs";

import { executeTemplate } from "./executeTemplate.js";

export async function handlebars(sourcePath: string, options?: object) {
	const source = await intake(sourcePath);

	if (!source) {
		throw new Error(
			`handlebars() must be given a path to a file. '${sourcePath}' does not exist.`,
		);
	}

	if (!Array.isArray(source)) {
		throw new Error(
			`handlebars() must be given a path to a file. '${sourcePath}' is a directory.`,
		);
	}

	return executeTemplate(source[0], options);
}
