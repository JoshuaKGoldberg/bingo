import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";

const options = { owner: "StubOwner", repository: "stub-repository" };

const mockCreateUsingTemplate = vi.fn();
const mockCreateInOrg = vi.fn();
const mockCreateForAuthenticatedUser = vi.fn();
const mockGetAuthenticated = vi.fn();
const mockRequest = vi.fn();

const createMockOctokit = () =>
	({
		request: mockRequest,
		rest: {
			repos: {
				createForAuthenticatedUser: mockCreateForAuthenticatedUser,
				createInOrg: mockCreateInOrg,
				createUsingTemplate: mockCreateUsingTemplate,
			},
			users: {
				getAuthenticated: mockGetAuthenticated,
			},
		},
	}) as unknown as Octokit;

describe("createRepositoryOnGitHub", () => {
	it("creates using a template when one is provided", async () => {
		mockRequest.mockResolvedValue({ data: [{}] });

		const template = {
			owner: "JoshuaKGoldberg",
			repository: "create-typescript-app",
		};

		await createRepositoryOnGitHub(options, createMockOctokit(), template);

		expect(mockCreateForAuthenticatedUser).not.toHaveBeenCalled();
		expect(mockCreateInOrg).not.toHaveBeenCalled();
		expect(mockCreateUsingTemplate).toHaveBeenCalledWith({
			name: options.repository,
			owner: options.owner,
			template_owner: template.owner,
			template_repo: template.repository,
		});
	});

	it("creates under the user when the user is the owner", async () => {
		mockGetAuthenticated.mockResolvedValueOnce({
			data: {
				login: options.owner,
			},
		});
		mockRequest.mockResolvedValue({ data: [{}] });

		await createRepositoryOnGitHub(options, createMockOctokit());

		expect(mockCreateForAuthenticatedUser).toHaveBeenCalledWith({
			name: options.repository,
		});
		expect(mockCreateInOrg).not.toHaveBeenCalled();
		expect(mockCreateUsingTemplate).not.toHaveBeenCalled();
	});

	it("creates under an org when the user is not the owner", async () => {
		const login = "other-user";
		mockGetAuthenticated.mockResolvedValueOnce({ data: { login } });
		mockRequest.mockResolvedValue({ data: [{}] });

		await createRepositoryOnGitHub(options, createMockOctokit());

		expect(mockCreateForAuthenticatedUser).not.toHaveBeenCalled();
		expect(mockCreateInOrg).toHaveBeenCalledWith({
			name: options.repository,
			org: options.owner,
		});
		expect(mockCreateUsingTemplate).not.toHaveBeenCalled();
	});

	it("resolves only after labels have the same length thrice in a row when the repository does not have labels for fewer than 35 calls", async () => {
		mockGetAuthenticated.mockResolvedValueOnce({ data: {} });
		mockRequest
			.mockResolvedValueOnce({ data: [] })
			.mockResolvedValueOnce({ data: [] })
			.mockResolvedValueOnce({ data: [{}] })
			.mockResolvedValueOnce({ data: [{}] })
			.mockResolvedValueOnce({ data: [{}] });

		await createRepositoryOnGitHub(options, createMockOctokit());

		expect(mockRequest).toHaveBeenCalledTimes(5);
	});

	it("resolves after 35 retries when the repository does not have labels for 35 calls", async () => {
		mockGetAuthenticated.mockResolvedValueOnce({ data: {} });
		mockRequest.mockResolvedValue({ data: [] });

		await createRepositoryOnGitHub(options, createMockOctokit());

		expect(mockRequest).toHaveBeenCalledTimes(35);
	});

	it("resolves after 35 retries when the repository labels keep increasing in count for 35 calls", async () => {
		let callCount = 0;

		mockGetAuthenticated.mockResolvedValueOnce({ data: {} });
		mockRequest.mockImplementation(() => {
			callCount += 1;
			return Promise.resolve({ data: new Array(callCount).map(() => ({})) });
		});

		await createRepositoryOnGitHub(options, createMockOctokit());

		expect(mockRequest).toHaveBeenCalledTimes(35);
	});
});
