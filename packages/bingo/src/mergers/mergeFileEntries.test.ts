import { CreatedFileEntry } from "bingo-fs";
import { describe, expect, test } from "vitest";

import { mergeFileEntries } from "./mergeFileEntries.js";

const path = ["test", "path"];

describe("mergeFileEntries", () => {
	test.each([
		["", "", ""],
		["", false, ""],
		["", undefined, ""],
		[false, "", ""],
		[false, false, undefined],
		[false, undefined, undefined],
		[undefined, "", ""],
		[undefined, false, undefined],
		[undefined, undefined, undefined],
		["a", "a", "a"],
		["a", ["a"], "a"],
		["a", ["a", {}], "a"],
		[["a"], "a", "a"],
		[["a"], ["a"], "a"],
		[["a"], ["a"], "a"],
		[["a", {}], "a", "a"],
		[["a", {}], ["a", {}], "a"],
		[["a", {}], ["a", {}], "a"],
		[
			["a", { executable: true }],
			["a", { executable: true }],
			["a", { executable: true }],
		],
		[
			["a", { executable: true }],
			["a", { executable: false }],
			new Error(`Conflicting created file executable at path: 'test/path'.`),
		],
		["a", "b", new Error("Conflicting created files at path: 'test/path'.")],
		[
			["a"],
			["b"],
			new Error("Conflicting created files at path: 'test/path'."),
		],
	] satisfies [
		CreatedFileEntry | false | undefined,
		CreatedFileEntry | false | undefined,
		CreatedFileEntry | Error | undefined,
	][])("%j with %j", (first, second, expected) => {
		if (expected instanceof Error) {
			expect(() => mergeFileEntries(first, second, path)).toThrow(expected);
		} else {
			expect(mergeFileEntries(first, second, path)).toEqual(expected);
		}
	});
});
