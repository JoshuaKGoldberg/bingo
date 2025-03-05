import { describe, expect, test, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { isTemplateConfig } from "./isTemplateConfig.js";

const template = createTemplate({
	about: { name: "Test Template" },
	options: {},
	produce: vi.fn(),
});

describe("isTemplateConfig", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ template: null }, false],
		[{ template: {} }, false],
		[{ refinements: { options: {} }, template: {} }, false],
		[{ refinements: null }, false],
		[{ refinements: {} }, false],
		[{ refinements: {}, template: {} }, false],
		[{ template }, true],
		[{ template }, true],
		[{ options: {}, template }, true],
		[{ refinements: {}, template }, true],
		[{ options: {}, refinements: {}, template }, true],
	])("%j", (input, expected) => {
		const actual = isTemplateConfig(input);

		expect(actual).toBe(expected);
	});
});
