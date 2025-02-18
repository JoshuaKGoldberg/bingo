import * as fs from "node:fs/promises";

import { ReadingFileSystem } from "./types.js";

export function createReadingFileSystem(): ReadingFileSystem {
	return {
		readDirectory: async (filePath: string) => await fs.readdir(filePath),
		readFile: async (filePath: string) =>
			(await fs.readFile(filePath)).toString(),
	};
}
