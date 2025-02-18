import { describe, expect, it, vi } from "vitest";

import { clearTemplateFiles } from "./clearTemplateFiles.js";

const mockReaddir = vi.fn();
const mockRm = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
	get rm() {
		return mockRm;
	},
}));

const mockIsForkOfTemplate = vi.fn();

vi.mock("./isForkOfTemplate", () => ({
	get isForkOfTemplate() {
		return mockIsForkOfTemplate;
	},
}));

const directory = "path/to";

describe("clearTemplateFiles", () => {
	it("deletes non-.git children", async () => {
		mockIsForkOfTemplate.mockResolvedValueOnce(true);
		mockReaddir.mockResolvedValueOnce([
			".git",
			".github",
			"src",
			"package.json",
		]);

		await clearTemplateFiles(directory);

		expect(mockRm).not.toHaveBeenCalledWith(".git", expect.any(Object));
		expect(mockRm).toHaveBeenCalledWith(".github", { recursive: true });
		expect(mockRm).toHaveBeenCalledWith("src", { recursive: true });
		expect(mockRm).toHaveBeenCalledWith("package.json", { recursive: true });
	});
});
