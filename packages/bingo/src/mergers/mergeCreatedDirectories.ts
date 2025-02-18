import { CreatedDirectory } from "bingo-fs";

import { mergeFileEntries } from "./mergeFileEntries.js";

export function mergeCreatedDirectories(
	firsts: CreatedDirectory,
	seconds: CreatedDirectory,
) {
	return mergeCreatedDirectoriesWorker(firsts, seconds, []);
}

function mergeCreatedDirectoriesWorker(
	firsts: CreatedDirectory,
	seconds: CreatedDirectory,
	path: string[],
) {
	const result: CreatedDirectory = { ...firsts };

	for (const i in seconds) {
		const second = seconds[i];
		if (!(i in firsts)) {
			result[i] = second;
			continue;
		}

		const first = firsts[i];
		const nextPath = [...path, i];

		const firstIsDirectory = typeof first === "object" && !Array.isArray(first);
		const secondIsDirectory =
			typeof second === "object" && !Array.isArray(second);

		if (firstIsDirectory !== secondIsDirectory) {
			throw new Error(
				`Conflicting created directory and file at path: '${nextPath.join("/")}'.`,
			);
		}

		result[i] = firstIsDirectory
			? mergeCreatedDirectoriesWorker(
					first,
					second as CreatedDirectory,
					nextPath,
				)
			: mergeFileEntries(first, second, nextPath);
	}

	return result;
}
