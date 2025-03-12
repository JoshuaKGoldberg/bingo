import { CreatedFetchRequest } from "bingo-requests";
import { describe, expect, it } from "vitest";

import { mergeFetchRequests } from "./mergeFetchRequests.js";

describe("mergeFetchRequests", () => {
	it("returns the second request when there are no existing requests", () => {
		const second: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = mergeFetchRequests([], second);

		expect(actual).toEqual([second]);
	});

	it("returns both requests when they have different URLs", () => {
		const first: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo/about",
		};

		const second: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo/build/about",
		};

		const actual = mergeFetchRequests([first], second);

		expect(actual).toEqual([first, second]);
	});

	it("returns just the first request when a next request is identical", () => {
		const first: CreatedFetchRequest = {
			type: "fetch",
			url: "https://create.bingo",
		};

		const second = { ...first };

		const actual = mergeFetchRequests([first], second);

		expect(actual).toEqual([first]);
	});

	it("returns a merged init version of the first request when a next request has the same endpoint and different init", () => {
		const first: CreatedFetchRequest = {
			init: { keepalive: false, method: "GET" },
			type: "fetch",
			url: "https://create.bingo",
		};

		const second: CreatedFetchRequest = {
			init: { body: "...", method: "POST" },
			type: "fetch",
			url: "https://create.bingo",
		};

		const actual = mergeFetchRequests([first], second);

		expect(actual).toEqual([
			{
				init: {
					body: "...",
					keepalive: false,
					method: "POST",
				},
				type: "fetch",
				url: "https://create.bingo",
			},
		]);
	});
});
