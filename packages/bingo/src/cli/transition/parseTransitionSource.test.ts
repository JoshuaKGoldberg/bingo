import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import {
	parseTransitionSource,
	TransitionSource,
} from "./parseTransitionSource.js";

const mockTryImportConfig = vi.fn();

vi.mock("../../config/tryImportConfig.js", () => ({
	get tryImportConfig() {
		return mockTryImportConfig;
	},
}));

vi.mock("../display/createClackDisplay.js", () => ({
	createClackDisplay: () => ({
		spinner: {
			start: vi.fn(),
			stop: vi.fn(),
		},
	}),
}));

const mockTryImportTemplate = vi.fn();

vi.mock("../importers/tryImportTemplate.js", () => ({
	get tryImportTemplate() {
		return mockTryImportTemplate;
	},
}));

describe("parseTransitionSource", () => {
	it("returns a CLI error when configFile and from are undefined", () => {
		const actual = parseTransitionSource({
			directory: ".",
		});

		expect(actual).toEqual(
			new Error(
				"Existing repository detected. To transition an existing repository, either create a bingo.config file or provide the name or path of a template.",
			),
		);
	});

	it("returns a CLI error when configFile and from are both defined", () => {
		const actual = parseTransitionSource({
			configFile: "bingo.config.js",
			directory: ".",
			from: "my-app",
		});

		expect(actual).toEqual(
			new Error(
				"--mode transition cannot combine an existing config file (bingo.config.js) with an explicit --from (my-app).",
			),
		);
	});

	it("returns a config loader when only configFile is defined", async () => {
		const template = createTemplate({
			produce: () => ({}),
		});

		mockTryImportConfig.mockResolvedValueOnce({ template });

		const actual = parseTransitionSource({
			configFile: "bingo.config.js",
			directory: ".",
		});

		expect(actual).toEqual({
			descriptor: "bingo.config.js",
			load: expect.any(Function),
			type: "config file",
		});

		const loaded = await (actual as TransitionSource).load();
		expect(loaded).toBe(template);
		expect(mockTryImportTemplate).not.toHaveBeenCalled();
	});

	it("returns a template loader when only from is defined", async () => {
		const expected = { configFile: true };

		mockTryImportTemplate.mockResolvedValueOnce(expected);

		const actual = parseTransitionSource({
			directory: ".",
			from: "my-app",
		});

		expect(actual).toEqual({
			descriptor: "my-app",
			load: expect.any(Function),
			type: "template",
		});

		const loaded = await (actual as TransitionSource).load();
		expect(loaded).toBe(expected);
		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});
});
