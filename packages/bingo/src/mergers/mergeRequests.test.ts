import { CreatedFetchRequest, CreatedOctokitRequest } from "bingo-requests";
import { describe, expect, it } from "vitest";

import { mergeRequests } from "./mergeRequests.js";

const owner = "test-owner";
const repo = "test-repo";

describe("mergeRequests", () => {
	it("returns fetch and octokit requests together when both are provided", () => {
		const first: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const second: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = mergeRequests([first], [second]);

		expect(actual).toEqual([first, second]);
	});

	it("returns one merged request when a new request can be merged", () => {
		const first: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const second: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = mergeRequests(
			[first, second],
			[{ ...second, init: { method: "POST" } }],
		);

		expect(actual).toEqual([{ ...second, init: { method: "POST" } }, first]);
	});
});
