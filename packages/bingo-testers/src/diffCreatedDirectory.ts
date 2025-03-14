import { CreatedDirectory, CreatedEntry, CreatedFileMetadata } from "bingo-fs";
import { createTwoFilesPatch } from "diff";
import path from "node:path";
import { withoutUndefinedProperties } from "without-undefined-properties";

export interface DiffedCreatedDirectory {
	[i: string]: DiffedCreatedDirectory | DiffedCreatedFileEntry | undefined;
}

export type DiffedCreatedFileEntry =
	| [string]
	| [string | undefined, DiffedCreatedFileMetadata?]
	| CreatedEntry
	| DiffedCreatedDirectory
	| string;

export interface DiffedCreatedFileMetadata {
	executable?: string;
}

export type ProcessText = (text: string, filePath: string) => string;

export function diffCreatedDirectory(
	actual: CreatedDirectory,
	created: CreatedDirectory,
	processText: ProcessText,
): DiffedCreatedDirectory | undefined {
	const result = diffCreatedDirectoryWorker(actual, created, ".", processText);

	return result && withoutUndefinedProperties(result);
}

function diffCreatedDirectoryChild(
	childActual: CreatedEntry | undefined,
	childCreated: CreatedEntry | undefined,
	pathToChild: string,
	processText: ProcessText,
): DiffedCreatedFileEntry | undefined {
	if (childActual === undefined) {
		return childCreated;
	}

	if (childCreated === undefined) {
		return undefined;
	}

	if (typeof childActual === "string") {
		if (typeof childCreated === "string") {
			return diffCreatedFileText(
				childActual,
				childCreated,
				pathToChild,
				processText,
			);
		}
	}

	if (Array.isArray(childActual)) {
		if (Array.isArray(childCreated)) {
			const fileDiff = diffCreatedFileText(
				childActual[0],
				childCreated[0],
				pathToChild,
				processText,
			);
			const optionsDiff = diffCreatedFileMetadata(
				childActual[1],
				childCreated[1],
				pathToChild,
			);

			return (fileDiff ?? optionsDiff) ? [fileDiff, optionsDiff] : undefined;
		}

		if (typeof childCreated === "string") {
			return diffCreatedFileText(
				childActual[0],
				childCreated,
				pathToChild,
				processText,
			);
		}

		return `Mismatched ${pathToChild}: actual is created file; created is ${typeof childCreated}.`;
	}

	if (Array.isArray(childCreated)) {
		if (typeof childActual === "string") {
			return diffCreatedFileText(
				childActual,
				childCreated[0],
				pathToChild,
				processText,
			);
		}

		return `Mismatched ${pathToChild}: actual is ${typeof childActual}; created is created file.`;
	}

	if (typeof childActual === "object") {
		if (typeof childCreated === "object") {
			return diffCreatedDirectoryWorker(
				childActual,
				childCreated,
				pathToChild,
				processText,
			);
		}
	}

	return `Mismatched ${pathToChild}: actual is ${typeof childActual}; created is ${typeof childCreated}.`;
}

function diffCreatedDirectoryWorker(
	actual: CreatedDirectory,
	created: CreatedDirectory,
	pathTo: string,
	processText: ProcessText,
): DiffedCreatedDirectory | undefined {
	const result: DiffedCreatedDirectory = {};

	for (const [childName, childCreated] of Object.entries(created)) {
		if (!(childName in actual)) {
			result[childName] = undefinedIfEmpty(childCreated);
			continue;
		}

		const childActual = actual[childName];
		const pathToChild = path.join(pathTo, childName);

		const childDiffed = diffCreatedDirectoryChild(
			childActual,
			childCreated,
			pathToChild,
			processText,
		);

		if (childDiffed !== undefined) {
			result[childName] = childDiffed;
		}
	}

	return undefinedIfEmpty(withoutUndefinedProperties(result));
}

function diffCreatedFileMetadata(
	actual: CreatedFileMetadata | undefined,
	created: CreatedFileMetadata | undefined,
	pathToFile: string,
): DiffedCreatedFileMetadata | undefined {
	if (
		actual?.executable === undefined ||
		created?.executable === undefined ||
		actual.executable === created.executable
	) {
		return undefined;
	}

	return {
		executable: diffCreatedFileText(
			actual.executable.toString(),
			created.executable.toString(),
			pathToFile,
			(text) => text,
		),
	};
}

function diffCreatedFileText(
	actual: string,
	created: string,
	pathToFile: string,
	processText: ProcessText,
) {
	const actualProcessed = processText(created, pathToFile);
	const createdProcessed = processText(actual, pathToFile);

	return actualProcessed === createdProcessed
		? undefined
		: createTwoFilesPatch(
				pathToFile,
				pathToFile,
				createdProcessed,
				actualProcessed,
			).replace(/^Index: .+\n=+\n-{3} .+\n\+{3} .+\n/gmu, "");
}
function undefinedIfEmpty<T>(value: T) {
	return !!value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		Object.keys(value).length === 0
		? undefined
		: value;
}
