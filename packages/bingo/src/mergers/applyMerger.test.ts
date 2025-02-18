import { describe, expect, it } from "vitest";

import { applyMerger } from "./applyMerger.js";

describe("applyMerger", () => {
	it("returns second when first is undefined", () => {
		const second = "b";

		const actual = applyMerger(undefined, second, (a, b) => a + b);

		expect(actual).toBe(second);
	});

	it("returns first when second is undefined", () => {
		const first = "a";

		const actual = applyMerger(first, undefined, (a, b) => a + b);

		expect(actual).toBe(first);
	});

	it("returns undefined when first and second are undefined", () => {
		const actual = applyMerger<string>(undefined, undefined, (a, b) => a + b);

		expect(actual).toBe(undefined);
	});
});
