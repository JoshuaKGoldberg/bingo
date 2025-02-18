import * as fs from "node:fs/promises";
import path from "node:path";

import { isModeExecutable } from "./isModeExecutable.js";
import { CreatedDirectory } from "./types.js";

export interface IntakeFromDirectorySettings {
	exclude?: RegExp;
}

export async function intakeFromDirectory(
	directoryPath: string,
	settings: IntakeFromDirectorySettings = {},
) {
	const directory: CreatedDirectory = {};
	const children = await fs.readdir(directoryPath);

	for (const child of children) {
		if (settings.exclude?.test(child)) {
			continue;
		}

		const childPath = path.join(directoryPath, child);
		const stat = await fs.stat(childPath);

		directory[child] = stat.isDirectory()
			? await intakeFromDirectory(childPath, settings)
			: [
					(await fs.readFile(childPath)).toString(),
					{ executable: isModeExecutable(stat.mode) },
				];
	}

	return directory;
}
