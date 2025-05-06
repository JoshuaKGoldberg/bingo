import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../../creators/createTemplate.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runModeSetup } from "./runModeSetup.js";

const mockCancel = Symbol("cancel");

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	log: {
		error: vi.fn(),
		message: vi.fn(),
		warn: vi.fn(),
	},
}));

const mockSystem = {
	fetchers: {
		octokit: {},
	},
	runner: vi.fn(),
};

vi.mock("../../contexts/createSystemContextWithAuth.js", () => ({
	get createSystemContextWithAuth() {
		return vi.fn().mockResolvedValue(mockSystem);
	},
}));

const mockLogStartText = vi.fn();

vi.mock("../loggers/logStartText", () => ({
	get logStartText() {
		return mockLogStartText;
	},
}));

const mockPrepareOptions = vi.fn();

vi.mock("../../preparation/prepareOptions.js", () => ({
	get prepareOptions() {
		return mockPrepareOptions;
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

const mockCreateTrackingBranches = vi.fn();

vi.mock("../createTrackingBranches.js", () => ({
	get createTrackingBranches() {
		return mockCreateTrackingBranches;
	},
}));

const mockPromptForDirectory = vi.fn();

vi.mock("../prompts/promptForDirectory.js", () => ({
	get promptForDirectory() {
		return mockPromptForDirectory;
	},
}));

const mockPromptForOptionSchemas = vi.fn();

vi.mock("../prompts/promptForOptionSchemas.js", () => ({
	get promptForOptionSchemas() {
		return mockPromptForOptionSchemas;
	},
}));

const mockRunTemplate = vi.fn();

vi.mock("../../runners/runTemplate.js", () => ({
	get runTemplate() {
		return mockRunTemplate;
	},
}));

const mockCreateRepositoryOnGitHub = vi.fn();

vi.mock("./createRepositoryOnGitHub", () => ({
	get createRepositoryOnGitHub() {
		return mockCreateRepositoryOnGitHub;
	},
}));

const argv = ["npx", "bingo-my-app"];

const from = "create-example";

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

describe("runModeSetup", () => {
	it("returns a cancellation status when the directory prompt is cancelled", async () => {
		mockPromptForDirectory.mockResolvedValueOnce(mockCancel);

		const actual = await runModeSetup({
			argv,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("returns an error status when preparing options results in an error", async () => {
		mockPromptForDirectory.mockResolvedValueOnce("test-directory");
		mockPrepareOptions.mockResolvedValueOnce(new Error("Oh no!"));

		const actual = await runModeSetup({
			argv,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			status: CLIStatus.Error,
		});
	});

	it("returns a cancellation status when prompting for options is cancelled", async () => {
		mockPromptForDirectory.mockResolvedValueOnce("test-directory");
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			cancelled: true,
			prompted: {},
		});

		const actual = await runModeSetup({
			argv,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("returns an error status when online and creating a repository errors", async () => {
		mockPromptForDirectory.mockResolvedValueOnce("test-directory");
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: {},
		});

		const error = new Error("Oh no!");
		mockCreateRepositoryOnGitHub.mockResolvedValueOnce({ remote: error });

		const actual = await runModeSetup({
			argv,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			error,
			status: CLIStatus.Error,
		});
	});

	it("returns a success status when options and repository preparation succeed", async () => {
		mockPromptForDirectory.mockResolvedValueOnce("test-directory");
		mockPromptForOptionSchemas.mockResolvedValueOnce({
			prompted: {},
		});
		mockCreateRepositoryOnGitHub.mockResolvedValueOnce({});
		mockRunTemplate.mockResolvedValueOnce({});

		const actual = await runModeSetup({
			argv,
			display,
			from,
			template,
		});

		expect(actual).toEqual({
			outro: `Thanks for using ${chalk.bgGreenBright.black(from)}! 💝`,
			status: CLIStatus.Success,
			suggestions: undefined,
		});
	});
});
