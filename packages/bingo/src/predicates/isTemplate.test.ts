import { describe, expect, test, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { isTemplate } from "./isTemplate.js";

describe("isTemplate", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ options: {} }, false],
		[
			createTemplate({
				options: {},
				produce: vi.fn(),
			}),
			true,
		],
		[
			createTemplate({
				about: { name: "Test Template" },
				options: {},
				produce: vi.fn(),
			}),
			true,
		],
	])("%j", (input, expected) => {
		const actual = isTemplate(input);

		expect(actual).toBe(expected);
	});
});
