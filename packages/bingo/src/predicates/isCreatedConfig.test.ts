import { describe, expect, test, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { isCreatedConfig } from "./isCreatedConfig.js";

const template = createTemplate({
	about: { name: "Test Template" },
	options: {},
	produce: vi.fn(),
});

describe("isCreatedConfig", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ template: null }, false],
		[{ template: {} }, false],
		[{ settings: { options: {} }, template: {} }, false],
		[{ settings: null }, false],
		[{ settings: {} }, false],
		[{ settings: {}, template: {} }, false],
		[{ template }, true],
		[{ template }, true],
		[{ options: {}, template }, true],
		[{ settings: {}, template }, true],
		[{ options: {}, settings: {}, template }, true],
	])("%j", (input, expected) => {
		const actual = isCreatedConfig(input);

		expect(actual).toBe(expected);
	});
});
