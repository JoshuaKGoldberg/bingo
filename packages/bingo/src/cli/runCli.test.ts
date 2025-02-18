import chalk from "chalk";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { runCli } from "./runCli.js";
import { CLIStatus } from "./status.js";

vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	log: {
		message: vi.fn(),
	},
}));

const mockPackageData = { version: "1.2.3-test" };

vi.mock("../packageData.js", () => ({
	get packageData() {
		return mockPackageData;
	},
}));

const mockDisplay = {
	dumpItems: vi.fn(),
	spinner: {
		start: vi.fn(),
		stop: vi.fn(),
	},
};

vi.mock("./display/createClackDisplay.js", () => ({
	createClackDisplay: () => mockDisplay,
}));

const mockRunModeSetup = vi.fn();

vi.mock("./setup/runModeSetup.js", () => ({
	get runModeSetup() {
		return mockRunModeSetup;
	},
}));

const mockLogHelpText = vi.fn().mockReturnValue("(help text)");

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

const mockRunModeTransition = vi.fn();

vi.mock("./transition/runModeTransition.js", () => ({
	get runModeTransition() {
		return mockRunModeTransition;
	},
}));

const mockReadProductionSettings = vi.fn();

vi.mock("./readProductionSettings.js", () => ({
	get readProductionSettings() {
		return mockReadProductionSettings;
	},
}));

const mockLog = vi.fn();

describe("readProductionSettings", () => {
	beforeEach(() => {
		console.log = mockLog;
	});

	it("logs version when --version is provided", async () => {
		const actual = await runCli(["--version"]);

		expect(actual).toBe(CLIStatus.Success);
		expect(mockLogHelpText).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(mockPackageData.version);
	});

	it("logs an error outro when readProductionSettings resolves with an error", async () => {
		const message = "Oh no!";

		mockReadProductionSettings.mockResolvedValueOnce(new Error(message));

		const actual = await runCli([]);

		expect(actual).toBe(CLIStatus.Error);
		expect(mockLogHelpText).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
		expect(mockLogOutro).toHaveBeenCalledWith(chalk.red(message));
	});

	it("runs setup mode when readProductionSettings resolves with mode: setup and no --from is specified", async () => {
		const args: string[] = [];
		const status = CLIStatus.Success;

		mockReadProductionSettings.mockResolvedValueOnce({ mode: "setup" });
		mockRunModeSetup.mockResolvedValueOnce({ status });

		const actual = await runCli(args);

		expect(actual).toEqual(status);
		expect(mockRunModeSetup).toHaveBeenCalledWith({
			args,
			display: mockDisplay,
			from: undefined,
		});
		expect(mockRunModeTransition).not.toHaveBeenCalled();
	});

	it("runs setup mode when readProductionSettings resolves with mode: setup and an explicit --from is specified", async () => {
		const args = ["--from", "../create-typescript-app"];
		const status = CLIStatus.Success;

		mockReadProductionSettings.mockResolvedValueOnce({ mode: "setup" });
		mockRunModeSetup.mockResolvedValueOnce({ status });

		const actual = await runCli(args);

		expect(actual).toEqual(status);
		expect(mockRunModeSetup).toHaveBeenCalledWith({
			args,
			display: mockDisplay,
			from: "../create-typescript-app",
		});
		expect(mockRunModeTransition).not.toHaveBeenCalled();
	});

	it("runs setup mode when readProductionSettings resolves with mode: setup and an implicit --from is specified", async () => {
		const args = ["typescript-app"];
		const status = CLIStatus.Success;

		mockReadProductionSettings.mockResolvedValueOnce({ mode: "setup" });
		mockRunModeSetup.mockResolvedValueOnce({ status });

		const actual = await runCli(args);

		expect(actual).toEqual(status);
		expect(mockRunModeSetup).toHaveBeenCalledWith({
			args,
			display: mockDisplay,
			from: "create-typescript-app",
		});
		expect(mockRunModeTransition).not.toHaveBeenCalled();
	});

	it("runs transition mode when readProductionSettings resolves with mode: transition", async () => {
		const args: string[] = [];
		const configFile = "bingo.config.js";
		const status = CLIStatus.Success;

		mockReadProductionSettings.mockResolvedValueOnce({
			configFile,
			mode: "transition",
		});
		mockRunModeTransition.mockResolvedValueOnce({ status });

		const actual = await runCli(args);

		expect(actual).toEqual(status);
		expect(mockRunModeTransition).toHaveBeenCalledWith({
			args,
			configFile,
			display: mockDisplay,
			from: undefined,
		});
		expect(mockRunModeSetup).not.toHaveBeenCalled();
	});

	it("logs the outro when resolved by the mode runner", async () => {
		const outro = "Goodbye.";
		const suggestions = ["abc"];

		mockReadProductionSettings.mockResolvedValueOnce({ mode: "setup" });
		mockRunModeSetup.mockResolvedValueOnce({ outro, suggestions });

		await runCli(["typescript-app"]);

		expect(mockLogOutro).toHaveBeenCalledWith(outro, { suggestions });
	});

	it("logs a cancellation outro when one is not resolved by the mode runner", async () => {
		const suggestions = ["abc"];

		mockReadProductionSettings.mockResolvedValueOnce({ mode: "setup" });
		mockRunModeSetup.mockResolvedValueOnce({ suggestions });

		await runCli(["typescript-app"]);

		expect(mockLogOutro).toHaveBeenCalledWith(
			chalk.yellow("Operation cancelled. Exiting - maybe another time? 👋"),
			{ suggestions },
		);
	});
});
