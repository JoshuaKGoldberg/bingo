import { describe, expect, it, vi } from "vitest";

import { loadHandlebars } from "./loadHandlebars.js";

const mockIntake = vi.fn();

vi.mock("bingo-fs", () => ({
	get intake() {
		return mockIntake;
	},
}));

const sourcePath = "path/to/template";

describe("loadHandlebars", () => {
	it("throws an error when the source does not exist", async () => {
		mockIntake.mockResolvedValueOnce(undefined);

		const act = async () => await loadHandlebars(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: loadHandlebars() must be given a path to a directory. 'path/to/template' does not exist.]`,
		);
	});

	it("throws an error when the source is a file", async () => {
		mockIntake.mockResolvedValueOnce(["..."]);

		const act = async () => await loadHandlebars(sourcePath);

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: loadHandlebars() must be given a path to a directory. 'path/to/template' is a file.]`,
		);
	});

	it.only("returns a handlebars() function that uses optionsDefaults when the source is a directory", async () => {
		mockIntake.mockResolvedValueOnce({
			"file.txt.hbs": [`{{abc}}{{def}}`],
		});

		const handlebars = await loadHandlebars(sourcePath, { abc: 123 });

		const actual = handlebars("file.txt.hbs", { def: 456 });

		expect(actual).toEqual(["123456"]);
	});
});
