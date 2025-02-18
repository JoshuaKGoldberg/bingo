import { describe, expect, test } from "vitest";

import { mergeSuggestions } from "./mergeSuggestions.js";

describe("mergeSuggestions", () => {
	test.each([
		[[], [], []],
		[[], ["a"], ["a"]],
		[["a"], [], ["a"]],
		[["a"], ["a"], ["a"]],
		[["a"], ["b"], ["a", "b"]],
		[["a"], ["b", "c"], ["a", "b", "c"]],
		[
			["a", "b", "c", "d"],
			["b", "c"],
			["a", "b", "c", "d"],
		],
	])("%j and %j", (first, second, expected) => {
		expect(mergeSuggestions(first, second)).toEqual(expected);
	});
});
