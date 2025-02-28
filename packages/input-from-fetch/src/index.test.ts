import { createMockFetchers, testInput } from "bingo-testers";
import { describe, expect, it, vi } from "vitest";

import { inputFromFetch } from "./index.js";

describe("inputFromFetch", () => {
	it("returns the result from running the network request", async () => {
		const resource = "https://example.com";
		const expected = { stdout: "123" };
		const fetch = vi.fn().mockResolvedValue(expected);

		const actual = await testInput(inputFromFetch, {
			args: [resource],
			fetchers: createMockFetchers(fetch),
		});

		expect(actual).toBe(expected);
		expect(fetch).toHaveBeenCalledWith(resource, undefined);
	});
});
