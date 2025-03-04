import { CreatedFileMetadata } from "bingo-fs";
import * as fs from "node:fs/promises";

import { createReadingFileSystem } from "./createReadingFileSystem.js";

export function createWritingFileSystem() {
	return {
		...createReadingFileSystem(),
		writeDirectory: async (directoryPath: string) =>
			void (await fs.mkdir(directoryPath, { recursive: true })),
		writeFile: async (
			filePath: string,
			contents: string,
			options?: CreatedFileMetadata,
		) => {
			await fs.writeFile(
				filePath,
				contents,
				options?.executable ? { mode: 0x755 } : undefined,
			);
		},
	};
}
