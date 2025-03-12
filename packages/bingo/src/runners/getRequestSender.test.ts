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

		const actual = getRequestSender(request);

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

		const actual = getRequestSender(request);

		expect(actual).toEqual({
			id: request.id,
			send: expect.any(Function),
		});
	});

	it("sends a request with fetchers.request sending a fetch request", async () => {
		const fetchers = createMockSystemFetchers();

		const request: CreatedFetchRequest = {
			id: "abc123",
			type: "fetch",
			url: "https://create.bingo",
		};

		await getRequestSender(request).send(fetchers as unknown as SystemFetchers);

		expect(fetchers.fetch).toHaveBeenCalledWith(request.url, request.init);
		expect(fetchers.octokit.request).not.toHaveBeenCalled();
	});

	it("returns a sender with url for id when given an Octokit request without id", () => {
		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const actual = getRequestSender(request);

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

		const actual = getRequestSender(request);

		expect(actual).toEqual({
			id: request.id,
			send: expect.any(Function),
		});
	});

	it("sends a request with fetchers.octokit.request sending an Octokit request", async () => {
		const fetchers = createMockSystemFetchers();

		const request: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		await getRequestSender(request).send(fetchers as unknown as SystemFetchers);

		expect(fetchers.fetch).not.toHaveBeenCalled();
		expect(fetchers.octokit.request).toHaveBeenCalledWith(
			request.endpoint,
			request.parameters,
		);
	});
});
