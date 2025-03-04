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
			try {
				// If the file had custom permissions written, it might support
				// being deleted but not being written to.
				// https://github.com/JoshuaKGoldberg/bingo/issues/238
				await fs.rm(filePath);
			} catch {
				// If the file didn't exist, that's fine too.
				// Or if we don't have rm permissions, we probably won't have
				// write permissions, so the subsequent writeFile will fail.
			}

			await fs.writeFile(
				filePath,
				contents,
				options?.executable ? { mode: 0x755 } : undefined,
			);
		},
	};
}
