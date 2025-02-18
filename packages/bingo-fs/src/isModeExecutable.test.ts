import { describe, expect, test } from "vitest";

import { isModeExecutable } from "./isModeExecutable.js";

describe("isModeExecutable", () => {
	test.each([
		["0x755", true],
		["0x777", true],
		["0x644", false],
	])("%s is %j", (mode, expected) => {
		expect(isModeExecutable(parseInt(mode, 16))).toBe(expected);
	});
});
