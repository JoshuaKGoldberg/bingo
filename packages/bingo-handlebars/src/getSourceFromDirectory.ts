import { IntakeDirectory, IntakeEntry } from "bingo-fs";

export function getSourceFromDirectory(
	directoryPath: string,
	directory: IntakeDirectory,
	filePath: string,
): IntakeEntry {
	const source = getSourceFromPathArray(directory, filePath.split(/[/\\]/));

	if (!source) {
		throw new Error(
			`Source '${filePath}' does not exist under '${directoryPath}'.`,
		);
	}

	return source;
}

function getSourceFromPathArray(
	directory: IntakeDirectory,
	filePath: string[],
): IntakeDirectory | IntakeEntry | undefined {
	if (!filePath.length) {
		return directory;
	}

	const child = directory[filePath[0]];

	if (Array.isArray(child) || !child) {
		return child;
	}

	return getSourceFromPathArray(child, filePath.slice(1));
}
