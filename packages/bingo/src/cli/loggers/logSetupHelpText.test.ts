import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { logSetupHelpText } from "./logSetupHelpText.js";

const mockInfo = vi.fn();
const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return { info: mockInfo, message: mockMessage };
	},
}));

const mockTryImportTemplate = vi.fn();

vi.mock("../importers/tryImportTemplate.js", () => ({
	get tryImportTemplate() {
		return mockTryImportTemplate;
	},
}));

const mockLogHelpText = vi.fn();

vi.mock("./logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

const mockLogSchemasHelpOptions = vi.fn();

vi.mock("./logSchemasHelpOptions.js", () => ({
	get logSchemasHelpOptions() {
		return mockLogSchemasHelpOptions;
	},
}));

describe("logSetupHelpText", () => {
	it("logs a straightforward message without loading when from is undefined and help is false", async () => {
		const actual = await logSetupHelpText(undefined, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockMessage).toHaveBeenCalledWith(
			[
				`Try it out with:`,
				`  ${chalk.green("npx bingo typescript-app@beta")}`,
			].join("\n"),
		);
		expect(mockLogHelpText).not.toHaveBeenCalled();
	});

	it("logs general help text without loading when from is undefined and help is true", async () => {
		const actual = await logSetupHelpText(undefined, {
			help: true,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("setup");
	});

	it("returns the error when help is false and loading the template is an error", async () => {
		const from = "bingo-my-app";
		const error = new Error("Oh no!");

		mockTryImportTemplate.mockResolvedValueOnce(error);

		const actual = await logSetupHelpText(from, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			error,
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
	});

	it("returns a success when help is false and loading the template succeeds", async () => {
		const from = "bingo-my-app";
		const template = createTemplate({
			about: { name: "Test Template" },
			options: {},
			produce: vi.fn(),
		});

		mockTryImportTemplate.mockResolvedValueOnce(template);

		const actual = await logSetupHelpText(from, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockLogSchemasHelpOptions).toHaveBeenCalledWith(
			from,
			template.options,
		);
	});
});
