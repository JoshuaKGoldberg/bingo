import { describe, expect, it, vi } from "vitest";

import { handlebarsFile } from "./handlebarsFile.js";

const mockIntake = vi.fn();

vi.mock("bingo-fs", async () => ({
	...(await vi.importActual("bingo-fs")),
	get intake() {
		return mockIntake;
	},
}));

const sourcePath = "path/to/template";

const options = { abc: 123 };

describe("handlebarsFile", () => {
	it("throws an error when the source does not exist", async () => {
		mockIntake.mockResolvedValueOnce(undefined);

		const act = async () => await handlebarsFile(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: handlebarsDirectory() must be given a path to a file or directory. 'path/to/template' does not exist.]`,
		);
	});

	it("throws an error when the source is a directory", async () => {
		mockIntake.mockResolvedValueOnce({ index: ["..."] });

		const act = async () => await handlebarsFile(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: handlebarsDirectory() must be given a path to a file. 'path/to/template' is a directory.]`,
		);
	});

	it("calls executeTemplatesRecursive with the options when the source exists", async () => {
		mockIntake.mockResolvedValueOnce(["{{abc}}"]);

		const actual = await handlebarsFile(sourcePath, options);

		expect(actual).toEqual(["123"]);
	});
});
