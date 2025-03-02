import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { promptForDirectory } from "./promptForDirectory.js";

const mockCancel = Symbol("cancel");
const mockText = vi.fn();
const mockWarn = vi.fn();

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	get log() {
		return {
			warn: mockWarn,
		};
	},
	get text() {
		return mockText;
	},
}));

const mockMkdir = vi.fn();

vi.mock("node:fs/promises", () => ({
	get mkdir() {
		return mockMkdir;
	},
}));

const templateWithoutAbout = createTemplate({
	options: {},
	produce: vi.fn(),
});

const templateWithName = createTemplate({
	about: { name: "Create Test Template" },
	options: {},
	produce: vi.fn(),
});

const mockValidateNewDirectory = vi.fn();

vi.mock("./validators.js", () => ({
	get validateNewDirectory() {
		return mockValidateNewDirectory;
	},
}));

const requestedDirectory = "my-app-requested";

describe("promptForDirectory", () => {
	it("creates and returns the requested directory when it does not yet exist", async () => {
		mockValidateNewDirectory.mockReturnValueOnce(false);

		const directory = await promptForDirectory({
			requestedDirectory,
			template: templateWithoutAbout,
		});

		expect(directory).toBe(requestedDirectory);
		expect(mockMkdir).toHaveBeenCalledWith(requestedDirectory, {
			recursive: true,
		});
	});

	it("does not prompt with an initial value when the template has no name", async () => {
		const promptedDirectory = "my-app-prompted";

		mockValidateNewDirectory.mockReturnValueOnce(true).mockReturnValue(false);
		mockText.mockResolvedValueOnce(promptedDirectory);

		await promptForDirectory({
			requestedDirectory,
			template: templateWithoutAbout,
		});

		expect(mockText).toHaveBeenCalledWith({
			message:
				"What will the directory and name of the repository be? (--directory)",
			validate: mockValidateNewDirectory,
		});
	});

	it("prompts with an initial value when the template has a name", async () => {
		const promptedDirectory = "my-app-prompted";

		mockValidateNewDirectory.mockReturnValueOnce(true).mockReturnValue(false);
		mockText.mockResolvedValueOnce(promptedDirectory);

		await promptForDirectory({
			requestedDirectory,
			template: templateWithName,
		});

		expect(mockText).toHaveBeenCalledWith({
			initialValue: "my-test-template",
			message:
				"What will the directory and name of the repository be? (--directory)",
			validate: mockValidateNewDirectory,
		});
	});

	it("warns and returns the directory when the requested directory exists and the prompt succeeds", async () => {
		const promptedDirectory = "my-app-prompted";

		mockValidateNewDirectory.mockReturnValueOnce(true).mockReturnValue(false);
		mockText.mockResolvedValueOnce(promptedDirectory);

		const directory = await promptForDirectory({
			requestedDirectory,
			template: templateWithoutAbout,
		});

		expect(directory).toBe(promptedDirectory);
		expect(mockMkdir).toHaveBeenCalledWith(promptedDirectory, {
			recursive: true,
		});
		expect(mockWarn).toHaveBeenCalledWith(
			"The 'my-app-requested' directory already exists.",
		);
	});

	it("returns the prompted directory without warning when no directory exists and the prompt succeeds", async () => {
		const promptedDirectory = "my-app-prompted";

		mockValidateNewDirectory.mockReturnValue(false);
		mockText.mockResolvedValueOnce(promptedDirectory);

		const directory = await promptForDirectory({
			template: templateWithoutAbout,
		});

		expect(directory).toBe(promptedDirectory);
		expect(mockMkdir).toHaveBeenCalledWith(promptedDirectory, {
			recursive: true,
		});
		expect(mockWarn).not.toHaveBeenCalled();
	});

	it("returns the cancellation when the requested directory exists and the prompt is cancelled", async () => {
		mockValidateNewDirectory.mockReturnValue(false);
		mockText.mockResolvedValueOnce(mockCancel);

		const directory = await promptForDirectory({
			template: templateWithoutAbout,
		});

		expect(directory).toBe(mockCancel);
		expect(mockMkdir).not.toHaveBeenCalled();
	});
});
