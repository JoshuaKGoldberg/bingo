import { describe, expect, it } from "vitest";

import { executeTemplatesRecursive } from "./executeTemplatesRecursive.js";

const options = {
	abc: 123,
};

describe("executeTemplatesRecursive", () => {
	it("returns undefined when given undefined", () => {
		const actual = executeTemplatesRecursive(undefined, options);

		expect(actual).toBeUndefined();
	});

	it("executes a template when source is an file with no options", () => {
		const actual = executeTemplatesRecursive(["{{abc}}"], options);

		expect(actual).toEqual(["123"]);
	});

	it("executes a template when source is an file with options", () => {
		const actual = executeTemplatesRecursive(
			["{{abc}}", { executable: true }],
			options,
		);

		expect(actual).toEqual(["123", { executable: true }]);
	});

	it("executes templates when source is a directory", () => {
		const actual = executeTemplatesRecursive(
			{
				files: {
					"first.hbs.txt": ["{{abc}}", { executable: true }],
				},
			},
			options,
		);

		expect(actual).toEqual({
			files: {
				"first.hbs.txt": ["123", { executable: true }],
			},
		});
	});
});
