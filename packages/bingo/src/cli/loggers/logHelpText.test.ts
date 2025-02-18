import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { logHelpText } from "./logHelpText.js";

const mockError = vi.fn();
const mockInfo = vi.fn();
const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return {
			error: mockError,
			info: mockInfo,
			message: mockMessage,
		};
	},
}));

describe("logHelpText", () => {
	it("logs the error when source is an error", () => {
		const message = "Oh no!";

		logHelpText("transition", new Error(message));

		expect(mockError).toHaveBeenCalledWith(message);
		expect(mockInfo).not.toHaveBeenCalled();
	});

	it("logs an info message when source is an object", () => {
		const descriptor = "place";
		const type = "thing";

		logHelpText("transition", { descriptor, type });

		expect(mockError).not.toHaveBeenCalled();
		expect(mockInfo).toHaveBeenCalledWith(
			[
				chalk.green(`--mode transition`),
				` detected with the `,
				chalk.blue(descriptor),
				" ",
				type,
			].join(""),
		);
	});
});
