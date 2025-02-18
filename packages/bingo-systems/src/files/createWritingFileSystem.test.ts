import { describe, expect, it, vi } from "vitest";

import { createWritingFileSystem } from "./createWritingFileSystem.js";

const mockMkdir = vi.fn();
const mockWriteFile = vi.fn();

vi.mock("node:fs/promises", () => ({
	get mkdir() {
		return mockMkdir;
	},
	get writeFile() {
		return mockWriteFile;
	},
}));

const contents = "abc123";
const directoryPath = "path/to/file";
const filePath = "path/to/file";

describe("createWritingFileSystem", () => {
	describe("writeDirectory", () => {
		it("writes with recursive: true", async () => {
			const system = createWritingFileSystem();

			await system.writeDirectory(directoryPath);

			expect(mockMkdir).toHaveBeenCalledWith(directoryPath, {
				recursive: true,
			});
		});
	});

	describe("writeFile", () => {
		it("writes without mode when options does not exist", async () => {
			const system = createWritingFileSystem();

			await system.writeFile(filePath, contents);

			expect(mockWriteFile).toHaveBeenCalledWith(filePath, contents, undefined);
		});

		it("writes without mode when options.executable is false", async () => {
			const system = createWritingFileSystem();

			await system.writeFile(filePath, contents, { executable: false });

			expect(mockWriteFile).toHaveBeenCalledWith(filePath, contents, undefined);
		});

		it("writes with mode 0x755 when options.executable is true", async () => {
			const system = createWritingFileSystem();

			await system.writeFile(filePath, contents, { executable: true });

			expect(mockWriteFile).toHaveBeenCalledWith(filePath, contents, {
				mode: 0x755,
			});
		});
	});
});
