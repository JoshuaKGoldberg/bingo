import { CreatedDirectory } from "bingo-fs";
import { WritingFileSystem } from "bingo-systems";
import * as path from "node:path";

export async function applyFilesToSystem(
	files: CreatedDirectory,
	system: WritingFileSystem,
	directory: string,
) {
	await writeToSystemWorker(files, system, directory);
}

async function writeToSystemWorker(
	files: CreatedDirectory,
	system: WritingFileSystem,
	basePath: string,
) {
	await system.writeDirectory(basePath);

	for (const [fileName, contents] of Object.entries(files)) {
		if (typeof contents === "string") {
			await system.writeFile(path.join(basePath, fileName), contents);
		} else if (Array.isArray(contents)) {
			await system.writeFile(
				path.join(basePath, fileName),
				contents[0],
				contents[1],
			);
		} else if (typeof contents === "object") {
			await writeToSystemWorker(
				contents,
				system,
				path.join(basePath, fileName),
			);
		}
	}
}
