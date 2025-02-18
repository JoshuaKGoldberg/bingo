import { describe, expect, test } from "vitest";

import { findPositionalFrom } from "./findPositionalFrom.js";

describe("findPositionalFrom", () => {
	test.each([
		[[], undefined],
		[["./create-typescript-app"], "./create-typescript-app"],
		[["./create-typescript-app", "other"], "./create-typescript-app"],
		[["./typescript-app"], "./typescript-app"],
		[["create-typescript-app"], "create-typescript-app"],
		[["typescript-app"], "create-typescript-app"],
	])("%j", (input, expected) => {
		expect(findPositionalFrom(input)).toBe(expected);
	});
});
