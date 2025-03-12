import { CreatedOctokitRequest } from "bingo-requests";
import { describe, expect, it } from "vitest";

import { mergeOctokitRequests } from "./mergeOctokitRequests.js";

const owner = "test-owner";
const repo = "test-repo";
const title = "Test Title";

describe("mergeOctokitRequests", () => {
	it("returns the second request when there are no existing requests", () => {
		const second: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const actual = mergeOctokitRequests([], second);

		expect(actual).toEqual([second]);
	});

	it("returns both requests when they have different endpoints", () => {
		const first: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "...", owner, repo },
			type: "octokit",
		};

		const second: CreatedOctokitRequest<"POST /repos/{owner}/{repo}/issues"> = {
			endpoint: "POST /repos/{owner}/{repo}/issues",
			parameters: { owner, repo, title },
			type: "octokit",
		};

		const actual = mergeOctokitRequests([first], second);

		expect(actual).toEqual([first, second]);
	});

	it("returns just the first request when a next request is identical", () => {
		const first: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "first", owner, repo },
			type: "octokit",
		};

		const second = { ...first };

		const actual = mergeOctokitRequests([first], second);

		expect(actual).toEqual([first]);
	});

	it("returns a merged parameters version of the first request when a next request has the same endpoint and different data", () => {
		const first: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: {
				description: "First description.",
				name: "first",
				owner,
				repo,
			},
			type: "octokit",
		};

		const second: CreatedOctokitRequest = {
			endpoint: "POST /repos/{owner}/{repo}/labels",
			parameters: { name: "second", owner, repo },
			type: "octokit",
		};

		const actual = mergeOctokitRequests([first], second);

		expect(actual).toEqual([
			{
				endpoint: "POST /repos/{owner}/{repo}/labels",
				parameters: {
					description: "First description.",
					name: "second",
					owner,
					repo,
				},
				type: "octokit",
			},
		]);
	});
});
