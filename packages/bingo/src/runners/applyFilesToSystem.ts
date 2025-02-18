import { CreatedDirectory } from "bingo-fs";
import { WritingFileSystem } from "bingo-systems";
import * as path from "node:path";
import prettier from "prettier";

export async function applyFilesToSystem(
	files: CreatedDirectory,
	system: WritingFileSystem,
	directory: string,
) {
	await writeToSystemWorker(files, system, directory);
}

async function format(fileName: string, text: string) {
	const parser = inferParser(fileName, text);
	if (!parser) {
		return text;
	}

	return await prettier.format(text, {
		parser,
		useTabs: true,
	});
}

function inferParser(fileName: string, text: string) {
	if (text.startsWith("{")) {
		return "json";
	}

	switch (fileName.split(".").at(-1)) {
		case "cjs":
		case "js":
			return "babel";
		case "json":
			return "json";
		case "md":
			return "markdown";
		case "yml":
			return "yaml";
	}

	return undefined;
}

async function writeToSystemWorker(
	files: CreatedDirectory,
	system: WritingFileSystem,
	basePath: string,
) {
	await system.writeDirectory(basePath);

	for (const [fileName, contents] of Object.entries(files)) {
		if (typeof contents === "string") {
			await system.writeFile(
				path.join(basePath, fileName),
				await format(fileName, contents),
			);
		} else if (Array.isArray(contents)) {
			await system.writeFile(
				path.join(basePath, fileName),
				await format(fileName, contents[0]),
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
