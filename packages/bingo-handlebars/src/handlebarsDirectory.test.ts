import { describe, expect, it, vi } from "vitest";

import { handlebarsDirectory } from "./handlebarsDirectory.js";

const mockIntake = vi.fn();

vi.mock("bingo-fs", async () => ({
	...(await vi.importActual("bingo-fs")),
	get intake() {
		return mockIntake;
	},
}));

const sourcePath = "path/to/template";

const options = { abc: 123 };

describe("handlebarsDirectory", () => {
	it("throws an error when the source does not exist", async () => {
		mockIntake.mockResolvedValueOnce(undefined);

		const act = async () => await handlebarsDirectory(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: handlebarsDirectory() must be given a path to a directory. 'path/to/template' does not exist.]`,
		);
	});

	it("throws an error when the source is a file", async () => {
		mockIntake.mockResolvedValueOnce(["..."]);

		const act = async () => await handlebarsDirectory(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: handlebarsDirectory() must be given a path to a directory. 'path/to/template' is a file.]`,
		);
	});

	it("calls executeTemplatesRecursive with the options when the source exists", async () => {
		mockIntake.mockResolvedValueOnce({
			index: ["{{abc}}"],
		});

		const actual = await handlebarsDirectory(sourcePath, options);

		expect(actual).toEqual({
			index: ["123"],
		});
	});
});
