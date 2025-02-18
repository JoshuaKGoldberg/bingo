import { describe, expect, test } from "vitest";

import { createBase } from "../creators/createBase.js";
import { isPreset } from "./isPreset.js";

const base = createBase({
	options: {},
});

const preset = base.createPreset({
	about: { name: "Test Preset" },
	blocks: [],
});

describe("isPreset", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ about: {}, base: {}, blocks: [] }, false],
		[preset, true],
	])("%j", (input, expected) => {
		const actual = isPreset(input);

		expect(actual).toBe(expected);
	});
});
