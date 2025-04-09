import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../../creators/createTemplate.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";

vi.mock("@clack/prompts");

const mockGetGitHubAuthToken = vi.fn();

vi.mock("get-github-auth-token", () => ({
	get getGitHubAuthToken() {
		return mockGetGitHubAuthToken;
	},
}));

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

const options = {
	owner: "mock-owner",
	repository: "mock-repository",
};

const templateWithoutOptions = createTemplate({
	produce: vi.fn(),
});

const templateWithOwnerAndRepository = createTemplate({
	options: { owner: z.string(), repository: z.string() },
	produce: vi.fn(),
});

const templateWithOwner = createTemplate({
	options: { owner: z.string() },
	produce: vi.fn(),
});

const templateWithRepository = createTemplate({
	options: { repository: z.string() },
	produce: vi.fn(),
});

describe("createRepositoryOnGitHub", () => {
	it("returns an error when both owner and repository are not string-likes", async () => {
		const mockRunner = vi.fn();

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			mockRunner,
			templateWithoutOptions,
		);

		expect(actual).toEqual(
			new Error(
				`To run with --mode setup and not --offline, options.owner and options.repository must be string-like schemas.`,
			),
		);
		expect(mockGetGitHubAuthToken).not.toHaveBeenCalled();
		expect(mockRunner).not.toHaveBeenCalled();
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).not.toHaveBeenCalled();
	});

	it("returns an error when owner is not a string-like", async () => {
		const mockRunner = vi.fn();

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			mockRunner,
			templateWithRepository,
		);

		expect(actual).toEqual(
			new Error(
				`To run with --mode setup and not --offline, options.owner must be a string-like schema.`,
			),
		);
		expect(mockGetGitHubAuthToken).not.toHaveBeenCalled();
		expect(mockRunner).not.toHaveBeenCalled();
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).not.toHaveBeenCalled();
	});

	it("returns an error when repository is not a string-like", async () => {
		const mockRunner = vi.fn();

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			mockRunner,
			templateWithOwner,
		);

		expect(actual).toEqual(
			new Error(
				`To run with --mode setup and not --offline, options.repository must be a string-like schema.`,
			),
		);
		expect(mockGetGitHubAuthToken).not.toHaveBeenCalled();
		expect(mockRunner).not.toHaveBeenCalled();
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).not.toHaveBeenCalled();
	});

	it("returns undefined when getGitHubAuthToken does not retrieve a token", async () => {
		const mockRunner = vi.fn();

		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: false });

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			mockRunner,
			templateWithOwnerAndRepository,
		);

		expect(actual).toBeUndefined();
		expect(mockRunner).not.toHaveBeenCalled();
		expect(mockPromptForOptionSchema).not.toHaveBeenCalled();
		expect(mockNewGitHubRepository).not.toHaveBeenCalled();
	});

	it("returns a repository locator from a requested owner and repository when both are provided", async () => {
		const owner = "mock-owner";
		const repository = "mock-repository";
		const mockRunner = vi.fn();

		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: true });

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			mockRunner,
			templateWithOwnerAndRepository,
		);

		expect(actual).toEqual(options);
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

		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: true });

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner: undefined, repository },
			mockOctokit,
			mockRunner,
			templateWithOwnerAndRepository,
		);

		expect(actual).toEqual(options);
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

		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: true });
		mockPromptForOptionSchema.mockResolvedValueOnce(owner);

		const actual = await createRepositoryOnGitHub(
			display,
			{ owner: undefined, repository },
			mockOctokit,
			mockRunner,
			templateWithOwnerAndRepository,
		);

		expect(actual).toEqual(options);
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

	it("returns the error when creating a repository errors", async () => {
		const error = new Error("Oh no!");

		mockGetGitHubAuthToken.mockResolvedValueOnce({ succeeded: true });
		mockNewGitHubRepository.mockRejectedValueOnce(error);

		const actual = await createRepositoryOnGitHub(
			display,
			options,
			mockOctokit,
			vi.fn(),
			templateWithOwnerAndRepository,
		);

		expect(actual).toBe(error);
	});
});
