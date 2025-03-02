import { CreatedFileEntry } from "bingo-fs";

import { executeTemplate } from "./executeTemplate.js";

export function executeTemplatesRecursive(
	source: CreatedFileEntry | undefined,
	options: object | undefined,
): CreatedFileEntry | undefined {
	if (!source) {
		return source;
	}

	if (Array.isArray(source)) {
		return source.length === 1
			? [executeTemplate(source[0], options)]
			: [executeTemplate(source[0], options), source[1]];
	}

	if (typeof source === "object") {
		return Object.fromEntries(
			Object.entries(source).map(([key, value]) => [
				key.replace(/\.hbs$/i, ""),
				executeTemplatesRecursive(value, options),
			]),
		);
	}

	return executeTemplate(source, options);
}
