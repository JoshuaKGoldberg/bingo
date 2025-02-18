import { describe, expect, it, test, vi } from "vitest";

import { logRerunSuggestion } from "./logRerunSuggestion.js";

const mockLog = {
	info: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	get log() {
		return mockLog;
	},
}));

describe("logRerunSuggestion", () => {
	it("does not log when there are no prompted entries", () => {
		logRerunSuggestion(["my-app"], {});

		expect(mockLog.info).not.toHaveBeenCalled();
	});

	it("logs when there are no prompted entries", () => {
		logRerunSuggestion(["my-app"], { abc: "def" });

		expect(mockLog.info).toHaveBeenCalled();
	});

	test("value stringification", () => {
		logRerunSuggestion(["my-app"], {
			"is-false": false,
			"is-true": true,
			multiple: ["def", 456],
			numeric: 123,
			spaced: "a bb ccc",
			stringy: "abc",
		});

		expect(mockLog.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Tip: to run again with the same input values, use: npx bingo my-app --is-false false --is-true --multiple def --multiple 456 --numeric 123 --spaced "a bb ccc" --stringy abc",
			  ],
			]
		`);
	});
});
