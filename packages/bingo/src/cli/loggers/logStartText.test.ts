import { describe, expect, it, vi } from "vitest";

import { logStartText } from "./logStartText.js";

const mockError = vi.fn();
const mockInfo = vi.fn();
const mockMessage = vi.fn();
const mockStep = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return {
			error: mockError,
			info: mockInfo,
			message: mockMessage,
			step: mockStep,
		};
	},
}));

describe("logStartText", () => {
	it("only logs an initial message when offline is falsy", () => {
		logStartText("transition", false);

		expect(mockStep.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --transition",
			  ],
			]
		`);
	});

	it("additionally logs an offline when offline is true", () => {
		logStartText("transition", true);

		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "--offline enabled. You'll need to git push any changes manually.",
			  ],
			]
		`);
		expect(mockStep.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --transition",
			  ],
			]
		`);
	});
});
