import { describe, expect, it, vi } from "vitest";

import { handlebars } from "./handlebars.js";

const mockIntake = vi.fn();

vi.mock("bingo-fs", () => ({
	get intake() {
		return mockIntake;
	},
}));

const sourcePath = "path/to/template";

const options = { abc: 123 };

describe("handlebars", () => {
	it("throws an error when the source does not exist", async () => {
		mockIntake.mockResolvedValueOnce(undefined);

		const act = async () => await handlebars(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: handlebars() must be given a path to a file or directory. 'path/to/template' does not exist.]`,
		);
	});

	it("calls executeTemplatesRecursive with the options when the source exists", async () => {
		const source = ["{{abc}}"];

		mockIntake.mockResolvedValueOnce(source);

		const actual = await handlebars(sourcePath, options);

		expect(actual).toEqual(["123"]);
	});
});
