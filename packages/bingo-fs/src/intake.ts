import * as fs from "node:fs/promises";
import path from "node:path";

import { isModeExecutable } from "./isModeExecutable.js";
import { IntakeDirectory, IntakeFileEntry } from "./types.js";

export interface IntakeSettings {
	exclude?: RegExp;
}

export async function intake(rootPath: string, settings: IntakeSettings = {}) {
	const stats = await fs.stat(rootPath);

	return stats.isDirectory()
		? intakeDirectory(rootPath, settings)
		: await intakeFile(rootPath, stats.mode);
}

async function intakeDirectory(
	directoryPath: string,
	settings: IntakeSettings,
): Promise<IntakeDirectory> {
	const directory: IntakeDirectory = {};
	const children = await fs.readdir(directoryPath);

	for (const child of children) {
		if (!settings.exclude?.test(child)) {
			directory[child] = await intake(
				path.join(directoryPath, child),
				settings,
			);
		}
	}

	return directory;
}

async function intakeFile(
	filePath: string,
	mode?: number,
): Promise<IntakeFileEntry> {
	return [
		(await fs.readFile(filePath)).toString(),
		{ executable: isModeExecutable(mode ?? (await fs.stat(filePath)).mode) },
	];
}
