import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createClackDisplay } from "./createClackDisplay.js";
import { runSpinnerTask } from "./runSpinnerTask.js";

const mockLog = {
	error: vi.fn(),
};
const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	get log() {
		return mockLog;
	},
	spinner: () => mockSpinner,
}));

describe("runSpinnerTask", () => {
	it("displays the error when the task throws an error", async () => {
		const error = new Error("Oh no!");

		const actual = await runSpinnerTask(
			createClackDisplay(),
			"Running task",
			"Ran task",
			vi.fn().mockRejectedValueOnce(error),
		);

		expect(actual).toBe(error);
		expect(mockLog.error).toHaveBeenCalledWith(chalk.red(error.stack));
		expect(mockSpinner.stop.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Error running task:",
			    1,
			  ],
			]
		`);
	});

	it("displays a general log when the task resolves with a value", async () => {
		const expected = { ok: true };

		const actual = await runSpinnerTask(
			createClackDisplay(),
			"Running task",
			"Ran task",
			vi.fn().mockResolvedValueOnce(expected),
		);

		expect(actual).toBe(expected);
		expect(mockLog.error).not.toHaveBeenCalled();
		expect(mockSpinner.stop.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Ran task",
			  ],
			]
		`);
	});
});
