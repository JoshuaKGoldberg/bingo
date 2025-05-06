import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { createClackDisplay } from "./display/createClackDisplay.js";
import { runCLI } from "./runCLI.js";
import { CLIStatus } from "./status.js";

const mockLogHelpText = vi.fn();

vi.mock("./loggers/logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

const mockLogOutro = vi.fn();

vi.mock("./loggers/logOutro.js", () => ({
	get logOutro() {
		return mockLogOutro;
	},
}));

const mockReadProductionSettings = vi.fn();

vi.mock("./readProductionSettings.js", () => ({
	get readProductionSettings() {
		return mockReadProductionSettings;
	},
}));

const mockRunModeSetup = vi.fn();

vi.mock("./setup/runModeSetup.js", () => ({
	get runModeSetup() {
		return mockRunModeSetup;
	},
}));

const mockRunModeTransition = vi.fn();

vi.mock("./transition/runModeTransition.js", () => ({
	get runModeTransition() {
		return mockRunModeTransition;
	},
}));

const template = createTemplate({
	produce: vi.fn(),
});

const argv = ["npx", "bingo-example"];

describe("runCli", () => {
	it("logs the error when readProductionSettings resolves an error", async () => {
		const error = new Error("Oh no!");
		mockReadProductionSettings.mockResolvedValueOnce(error);

		const actual = await runCLI({
			argv,
			display: createClackDisplay(),
			from: "",
			template,
			values: {},
		});

		expect(mockLogOutro).toHaveBeenCalledWith(chalk.red(error.message));
		expect(actual).toBe(CLIStatus.Error);
	});

	it("runs logHelpText when help is specified", async () => {
		mockReadProductionSettings.mockResolvedValueOnce({
			mode: "setup",
		});

		await runCLI({
			argv,
			display: createClackDisplay(),
			from: "",
			template,
			values: {
				help: true,
			},
		});

		expect(mockLogHelpText).toHaveBeenCalledWith("setup", "", template);
		expect(mockRunModeSetup).not.toHaveBeenCalled();
		expect(mockRunModeTransition).not.toHaveBeenCalled();
	});

	it("runs runModeSetup when productionSettings.mode is setup", async () => {
		mockReadProductionSettings.mockResolvedValueOnce({
			mode: "setup",
		});

		await runCLI({
			argv,
			display: createClackDisplay(),
			from: "",
			template,
			values: {},
		});

		expect(mockLogOutro).not.toHaveBeenCalled();
		expect(mockRunModeSetup).toHaveBeenCalled();
		expect(mockRunModeTransition).not.toHaveBeenCalled();
	});

	it("runs runModeTransition when productionSettings.mode is transition", async () => {
		mockReadProductionSettings.mockResolvedValueOnce({
			mode: "transition",
		});

		await runCLI({
			argv,
			display: createClackDisplay(),
			from: "",
			template,
			values: {},
		});

		expect(mockLogOutro).not.toHaveBeenCalled();
		expect(mockRunModeSetup).not.toHaveBeenCalled();
		expect(mockRunModeTransition).toHaveBeenCalled();
	});
});
