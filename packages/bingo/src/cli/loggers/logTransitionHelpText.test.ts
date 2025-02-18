import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { TransitionSource } from "../transition/parseTransitionSource.js";
import { logTransitionHelpText } from "./logTransitionHelpText.js";

const mockCancel = Symbol("cancel");
const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	spinner: () => mockSpinner,
}));

const mockLogHelpText = vi.fn();

vi.mock("./logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

describe("logTransitionHelpText", () => {
	it("returns a CLI error without spinning when source is an error", async () => {
		const source = new Error("Oh no!");

		const actual = await logTransitionHelpText(source);

		expect(actual).toEqual({
			error: source,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("transition", source);
	});

	it("returns the error when source.load resolves with an error", async () => {
		const descriptor = "bingo-test-app";
		const error = new Error("Oh no!");
		const source: TransitionSource = {
			descriptor,
			load: () => Promise.resolve(error),
			type: "template",
		};

		const actual = await logTransitionHelpText(source);

		expect(actual).toEqual({
			error,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("transition", source);
		expect(mockSpinner.stop).toHaveBeenCalledWith(
			`Could not load ${chalk.blue(descriptor)}.`,
			1,
		);
	});

	it("returns the cancellation when source.load is cancelled", async () => {
		const source: TransitionSource = {
			descriptor: "bingo-test-app",
			load: () => Promise.resolve(mockCancel),
			type: "template",
		};

		const actual = await logTransitionHelpText(source);

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
		expect(mockSpinner.stop).not.toHaveBeenCalled();
	});

	it("returns a success when source.load resolves with a config", async () => {
		const template = createTemplate({
			about: { name: "Test Template" },
			options: {},
			produce: vi.fn(),
		});
		const descriptor = "bingo-test-app";
		const source: TransitionSource = {
			descriptor,
			load: () => Promise.resolve(template),
			type: "template",
		};

		const actual = await logTransitionHelpText(source);

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockSpinner.stop).toHaveBeenCalledWith(
			`Loaded ${chalk.blue(descriptor)}`,
		);
	});
});
