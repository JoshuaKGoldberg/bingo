import { WritingFileSystem } from "bingo-systems";

import { createFailingFunction } from "./utils.js";

export function createMockFileSystem(
	fs?: Partial<WritingFileSystem>,
): WritingFileSystem {
	return {
		readDirectory: createFailingFunction("fs.readDirectory", "an input"),
		readFile: createFailingFunction("fs.readFile", "an input"),
		writeDirectory: createFailingFunction("fs.writeDirectory", "an input"),
		writeFile: createFailingFunction("fs.writeFile", "an input"),
		...fs,
	};
}
