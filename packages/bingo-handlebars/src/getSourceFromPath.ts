import { CreatedDirectory } from "bingo-fs";

export function getSourceFromPath(
	directory: CreatedDirectory,
	filePath: string,
) {
	return getSourceFromPathArray(directory, filePath.split(/[/\\]/));
}

function getSourceFromPathArray(
	directory: CreatedDirectory,
	filePath: string[],
) {
	if (!filePath.length) {
		return directory;
	}

	const child = directory[filePath[0]];

	if (Array.isArray(child)) {
		return child[0];
	}

	if (typeof child !== "object") {
		return child;
	}

	return getSourceFromPathArray(child, filePath.slice(1));
}
