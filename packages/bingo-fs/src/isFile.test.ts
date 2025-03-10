import { describe, expect, test } from "vitest";

import { isFile } from "./isFile.js";
import { CreatedEntry } from "./types.js";

describe("isFile", () => {
	test.each([
		[false, false],
		[undefined, false],
		[{}, false],
		["", true],
		[[""], true],
		[["..."], true],
		[["", {}], true],
		[["...", {}], true],
		[["", { executable: false }], true],
		[["", { executable: true }], true],
	] satisfies [CreatedEntry | undefined, boolean][])(
		"%s",
		(input, expected) => {
			expect(isFile(input)).toBe(expected);
		},
	);
});
