import { intake } from "bingo-fs";

import { executeTemplatesRecursive } from "./executeTemplatesRecursive.js";
import { getSourceFromPath } from "./getSourceFromPath.js";

export async function loadHandlebars(
	directoryPath: string,
	optionsDefaults?: object,
) {
	const sources = await intake(directoryPath);

	if (Array.isArray(sources)) {
		throw new Error(
			`loadHandlebars() must be given a path to a directory. '${directoryPath}' is a file.`,
		);
	}

	if (typeof sources !== "object") {
		throw new Error(
			`loadHandlebars() must be given a path to a directory. '${directoryPath}' does not exist.`,
		);
	}

	return function handlebars(sourcePath: string, options?: object) {
		const source = getSourceFromPath(sources, sourcePath);

		return executeTemplatesRecursive(source, {
			...optionsDefaults,
			...options,
		});
	};
}
