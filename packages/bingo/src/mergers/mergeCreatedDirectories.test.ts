import { CreatedDirectory } from "bingo-fs";
import { describe, expect, test } from "vitest";

import { mergeCreatedDirectories } from "./mergeCreatedDirectories.js";

describe("mergeFileCreations", () => {
	test.each([
		[{}, {}, {}],
		[{ a: false }, { a: undefined }, {}],
		[{ a: "" }, { a: "" }, { a: "" }],
		[{ a: "" }, { b: "" }, { a: "", b: "" }],
		[{ a: "1" }, { a: "2" }, "Conflicting created files at path: 'a'."],
		[{ a: "1" }, { a: ["2"] }, "Conflicting created files at path: 'a'."],
		[{ a: ["1"] }, { a: "2" }, "Conflicting created files at path: 'a'."],
		[{ a: ["1"] }, { a: ["2"] }, "Conflicting created files at path: 'a'."],
		[{ a: {} }, { a: {} }, { a: {} }],
		[{ a: {} }, { a: { b: "" } }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: {} }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: { b: "" } }, { a: { b: "" } }],
		[
			{ a: "" },
			{ a: {} },
			"Conflicting created directory and file at path: 'a'.",
		],
		[
			{ a: {} },
			{ a: "" },
			"Conflicting created directory and file at path: 'a'.",
		],
	] satisfies [
		CreatedDirectory,
		CreatedDirectory,
		CreatedDirectory | string,
	][])(
		"%j with %j",
		(
			first: CreatedDirectory,
			second: CreatedDirectory,
			expected?: object | string,
		) => {
			if (typeof expected === "string") {
				expect(() => mergeCreatedDirectories(first, second)).toThrow(expected);
			} else {
				expect(mergeCreatedDirectories(first, second)).toEqual(expected);
			}
		},
	);
});
