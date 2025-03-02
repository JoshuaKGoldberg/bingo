import { intake } from "bingo-fs";

import { executeTemplatesRecursive } from "./executeTemplatesRecursive.js";
import { getSourceFromDirectory } from "./getSourceFromDirectory.js";

export async function loadHandlebars(
	directoryPath: string,
	optionsDefaults?: object,
) {
	const sources = await intake(directoryPath);

	if (!sources) {
		throw new Error(
			`loadHandlebars() must be given a path to a directory. '${directoryPath}' does not exist.`,
		);
	}

	if (Array.isArray(sources)) {
		throw new Error(
			`loadHandlebars() must be given a path to a directory. '${directoryPath}' is a file.`,
		);
	}

	return function handlebars(sourcePath: string, options?: object) {
		const source = getSourceFromDirectory(directoryPath, sources, sourcePath);

		return executeTemplatesRecursive(source, {
			...optionsDefaults,
			...options,
		});
	};
}
