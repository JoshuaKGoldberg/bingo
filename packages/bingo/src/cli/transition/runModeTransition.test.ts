import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../../creators/createTemplate.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runModeTransition } from "./runModeTransition.js";

const mockLog = {
	error: vi.fn(),
	message: vi.fn(),
};

const mockCancel = Symbol("cancel");

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	get log() {
		return mockLog;
	},
	spinner: vi.fn(),
}));

vi.mock("bingo-fs");

const mockPrepareOptions = vi.fn();

vi.mock("../../preparation/prepareOptions.js", () => ({
	get prepareOptions() {
		return mockPrepareOptions;
	},
}));

const mockRunTemplate = vi.fn();

vi.mock("../../runners/runTemplate.js", () => ({
	get runTemplate() {
		return mockRunTemplate;
	},
}));

const mockSystem = {
	runner: vi.fn(),
};

vi.mock("../../contexts/createSystemContextWithAuth.js", () => ({
	get createSystemContextWithAuth() {
		return vi.fn().mockResolvedValue(mockSystem);
	},
}));

const mockPromptForOptionSchemas = vi.fn();

vi.mock("../prompts/promptForOptionSchemas.js", () => ({
	get promptForOptionSchemas() {
		return mockPromptForOptionSchemas;
	},
}));

const mockClearLocalGitTags = vi.fn();

vi.mock("../clearLocalGitTags.js", () => ({
	get clearLocalGitTags() {
		return mockClearLocalGitTags;
	},
}));

const mockCreateInitialCommit = vi.fn();

vi.mock("../createInitialCommit.js", () => ({
	get createInitialCommit() {
		return mockCreateInitialCommit;
	},
}));

const mockLogHelpText = vi.fn();

vi.mock("../loggers/logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

const mockLogRerunSuggestion = vi.fn();

vi.mock("../loggers/logRerunSuggestion.js", () => ({
	get logRerunSuggestion() {
		return mockLogRerunSuggestion;
	},
}));

const mockLogStartText = vi.fn();

vi.mock("../loggers/logStartText", () => ({
	get logStartText() {
		return mockLogStartText;
	},
}));

const mockClearTemplateFiles = vi.fn();

vi.mock("./clearTemplateFiles.js", () => ({
	get clearTemplateFiles() {
		return mockClearTemplateFiles;
	},
}));

const mockGetForkedRepositoryLocator = vi.fn();

vi.mock("./getForkedRepositoryLocator.js", () => ({
	get getForkedRepositoryLocator() {
		return mockGetForkedRepositoryLocator;
	},
}));

const mockReadConfigSettings = vi.fn();

vi.mock("./readConfigSettings.js", () => ({
	get readConfigSettings() {
		return mockReadConfigSettings;
	},
}));

const display: ClackDisplay = {
	dumpItems: vi.fn(),
	item: vi.fn(),
	log: vi.fn(),
	spinner: {
		message: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
	},
};

const template = createTemplate({
	about: { name: "Test Template" },
	options: {
		value: z.string().optional(),
	},
	produce: vi.fn(),
});

const templateWithRepository = createTemplate({
	about: { name: "Test Template", repository: { owner: "a", repository: "b" } },
	options: {},
	produce: vi.fn(),
});

const argv = ["npx", "bingo-my-app"];

const from = "create-example";

const promptedOptions = {
	abc: "def",
};

describe("runModeTransition", () => {
	it("logs help text instead of running when help is true", async () => {
		await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			help: true,
			template,
		});

		expect(mockLogHelpText).toHaveBeenCalledWith("transition", from, template);
		expect(mockLogStartText).not.toHaveBeenCalled();
	});

	it("returns the error when readConfigSettings resolves an error", async () => {
		const error = new Error("Oh no!");
		mockReadConfigSettings.mockResolvedValueOnce(error);

		const actual = await runModeTransition({
			argv,
			configFile: "example.config.ts",
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			error,
			status: CLIStatus.Error,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, {});
	});

	it("returns the error when prepareOptions throws an error", async () => {
		const error = new Error("Oh no!");
		mockPrepareOptions.mockRejectedValueOnce(error);

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			template,
		});

		expect(actual).toEqual({ status: CLIStatus.Error });
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, {});
	});

	it("returns the cancellation when promptForOptions is cancelled", async () => {
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			cancelled: true,
			prompted: promptedOptions,
		});

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, promptedOptions);
	});

	it("returns the error when runTemplate resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockRunTemplate.mockRejectedValueOnce(error);

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, promptedOptions);
	});

	it("doesn't clear the existing repository when the template does not have a repository locator", async () => {
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: promptedOptions,
		});

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your updated repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, promptedOptions);
	});

	it("clears the existing repository online when a forked repository locator is available and offline is falsy", async () => {
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			template: templateWithRepository,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your new repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockLogStartText).toHaveBeenCalledWith("transition", undefined);
		expect(mockClearTemplateFiles).toHaveBeenCalled();
		expect(mockClearLocalGitTags).toHaveBeenCalled();
		expect(mockCreateInitialCommit).toHaveBeenCalledWith(mockSystem.runner, {
			amend: true,
			push: true,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, promptedOptions);
	});

	it("clears the existing repository offline when a forked repository locator is available and offline is true", async () => {
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeTransition({
			argv,
			configFile: undefined,
			display,
			from,
			offline: true,
			template: templateWithRepository,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your new repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockLogStartText).toHaveBeenCalledWith("transition", true);
		expect(mockClearTemplateFiles).toHaveBeenCalled();
		expect(mockClearLocalGitTags).toHaveBeenCalled();
		expect(mockCreateInitialCommit).toHaveBeenCalledWith(mockSystem.runner, {
			amend: true,
			push: false,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(argv, promptedOptions);
	});
});
