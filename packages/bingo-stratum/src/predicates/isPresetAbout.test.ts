import { describe, expect, test } from "vitest";

import { isPresetAbout } from "./isPresetAbout.js";

describe("isPresetAbout", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ name: "" }, true],
	])("%j", (input, expected) => {
		const actual = isPresetAbout(input);

		expect(actual).toBe(expected);
	});
});
