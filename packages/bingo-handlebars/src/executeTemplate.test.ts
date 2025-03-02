import { describe, expect, it, vi } from "vitest";

import { executeTemplate } from "./executeTemplate.js";

const mockCompile = vi.fn();

vi.mock("handlebars", () => ({
	get default() {
		return {
			compile: mockCompile,
		};
	},
}));

describe("executeTemplate", () => {
	it("passes options to the template", () => {
		const options = { abc: 123 };
		const sourcePath = "file.hbs";
		const template = vi.fn();

		mockCompile.mockReturnValueOnce(template);

		executeTemplate(sourcePath, options);

		expect(mockCompile).toHaveBeenCalledWith(sourcePath);
		expect(template).toHaveBeenCalledWith(options);
	});
});
