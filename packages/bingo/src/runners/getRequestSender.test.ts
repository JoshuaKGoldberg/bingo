import { CreatedFetchRequest, CreatedOctokitRequest } from "bingo-requests";
import { SystemFetchers } from "bingo-systems";
import { describe, expect, it, vi } from "vitest";

import { getRequestSender } from "./getRequestSender.js";

function createMockSystemFetchers() {
	return {
		fetch: vi.fn(),
		octokit: { request: vi.fn() },
	};
}

const owner = "test-owner";
const repo = "test-repo";

describe("getRequestSender", () => {
	it("returns a sender with url for id when given a fetch request without id", () => {
		const request: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = getRequestSender(
			createMockSystemFetchers() as unknown as SystemFetchers,
			request,
		);

		expect(actual).toEqual({
			id: request.url,
			send: expect.any(Function),
		});
	});

	it("returns a sender with id for id when given a fetch request with id", () => {
		const request: CreatedFetchRequest = {
			id: "abc123",
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = getRequestSender(
			createMockSystemFetchers() as unknown as SystemFetchers,
			request,
		);

		expect(actual).toEqual({
			id: request.id,
			send: expect.any(Function),
		});
	});

	it("sends a request with fetchers.request when sending a fetch request", async () => {
		const fetchers = createMockSystemFetchers();

		const request: CreatedFetchRequest = {
			id: "abc123",
			type: "fetch",
			url: "https://create.bingo",
		};

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await getRequestSender(
			fetchers as unknown as SystemFetchers,
			request,
		)!.send();

		expect(fetchers.fetch).toHaveBeenCalledWith(request.url, request.init);
		expect(fetchers.octokit.request).not.toHaveBeenCalled();
	});

	it("returns undefined when given an Octokit request and fetchers.octokit is defined", () => {
		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const actual = getRequestSender(
			{ fetch: vi.fn(), octokit: undefined } as SystemFetchers,
			request,
		);

		expect(actual).toBeUndefined();
	});

	it("returns a sender with url for id when given an Octokit request without id", () => {
		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const actual = getRequestSender(
			createMockSystemFetchers() as unknown as SystemFetchers,
			request,
		);

		expect(actual).toEqual({
			id: request.endpoint,
			send: expect.any(Function),
		});
	});

	it("returns a sender with id for id when given an Octokit request with id", () => {
		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			id: "abc123",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const actual = getRequestSender(
			createMockSystemFetchers() as unknown as SystemFetchers,
			request,
		);

		expect(actual).toEqual({
			id: request.id,
			send: expect.any(Function),
		});
	});

	it("sends a request with the Octokit when sending an Octokit request and fetchers.octokit is defined", async () => {
		const fetchers = createMockSystemFetchers();

		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await getRequestSender(
			fetchers as unknown as SystemFetchers,
			request,
		)!.send();

		expect(fetchers.fetch).not.toHaveBeenCalled();
		expect(fetchers.octokit.request).toHaveBeenCalledWith(
			request.endpoint,
			request.parameters,
		);
	});
});
