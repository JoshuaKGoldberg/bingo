import { describe, expect, it, vi } from "vitest";

import { mergeRequests } from "./mergeRequests.js";

describe("mergeRequests", () => {
	it("returns both requests when they have different ids", () => {
		const first = {
			id: "a",
			send: vi.fn(),
		};
		const second = {
			id: "b",
			send: vi.fn(),
		};

		const actual = mergeRequests([first], [second]);

		expect(actual).toEqual([first, second]);
	});

	it("returns only the second request when they have the same id", () => {
		const first = {
			id: "a",
			send: vi.fn(),
		};
		const second = {
			id: "a",
			send: vi.fn(),
		};

		const actual = mergeRequests([first], [second]);

		expect(actual).toEqual([second]);
	});
});
