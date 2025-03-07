import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ClackDisplay } from "../display/createClackDisplay.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";

vi.mock("@clack/prompts");

const mockNewGitHubRepository = vi.fn();

vi.mock("new-github-repository", () => ({
	get newGitHubRepository() {
		return mockNewGitHubRepository;
	},
}));

const mockPromptForOptionSchema = vi.fn();

vi.mock("../prompts/promptForOptionSchema.js", () => ({
	get promptForOptionSchema() {
		return mockPromptForOptionSchema;
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

const mockOctokit = {} as Octokit;

describe("createRepositoryOnGitHub", () => {
	it("returns a repository locator from a requested owner and repository when both are provided", async () => {
		const owner = "mock-owner";
		const repository = "mock-repository";
		const mockRunner = vi.fn();

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner, repository },
			mockOctokit,
			mockRunner,
		);

		expect(actual).toEqual({ owner, repository });
		expect(mockRunner).not.toHaveBeenCalled();
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).toHaveBeenCalledWith({
			octokit: mockOctokit,
			owner,
			repository,
			template: undefined,
		});
	});

	it("returns a repository locator for the gh user when owner is undefined, gh retrieves a user, and creation succeeds", async () => {
		const owner = "mock-owner";
		const repository = "mock-repository";
		const mockRunner = vi.fn().mockResolvedValue({ stdout: owner });

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner: undefined, repository },
			mockOctokit,
			mockRunner,
		);

		expect(actual).toEqual({ owner, repository });
		expect(mockRunner).toHaveBeenCalledWith("gh config get user -h github.com");
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).toHaveBeenCalledWith({
			octokit: mockOctokit,
			owner,
			repository,
			template: undefined,
		});
	});

	it("returns a repository locator for the prompted user when owner is undefined, gh errors, and creation succeeds", async () => {
		const owner = "mock-owner";
		const repository = "mock-repository";
		const mockRunner = vi.fn().mockResolvedValue(new Error("Oh no!"));
		mockPromptForOptionSchema.mockResolvedValueOnce(owner);

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner: undefined, repository },
			mockOctokit,
			mockRunner,
		);

		expect(actual).toEqual({ owner, repository });
		expect(mockRunner).toHaveBeenCalledWith("gh config get user -h github.com");
		expect(mockPromptForOptionSchema).toHaveBeenCalledWith(
			"owner",
			expect.any(z.ZodString),
			expect.any(String),
			undefined,
		);
		expect(mockNewGitHubRepository).toHaveBeenCalledWith({
			octokit: mockOctokit,
			owner,
			repository,
			template: undefined,
		});
	});

	it("returns undefined when creating a repository errors", async () => {
		const owner = "mock-owner";
		const repository = "mock-repository";
		mockNewGitHubRepository.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner, repository },
			mockOctokit,
			vi.fn(),
		);

		expect(actual).toBeUndefined();
	});
});
