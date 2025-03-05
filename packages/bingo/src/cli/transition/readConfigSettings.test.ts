import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { readConfigSettings } from "./readConfigSettings.js";

const mockTryImportConfig = vi.fn();

vi.mock("../../config/tryImportConfig.js", () => ({
	get tryImportConfig() {
		return mockTryImportConfig;
	},
}));

const template = createTemplate({
	produce: vi.fn(),
});

const templateOther = createTemplate({
	produce: vi.fn(),
});

describe("readConfigSettings", () => {
	it("returns undefined when configFile is undefined", async () => {
		const actual = await readConfigSettings(undefined, ".", template);

		expect(actual).toBeUndefined();
		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});

	it("returns the error when tryImportConfig resolves an error", async () => {
		const error = new Error("Oh no!");
		mockTryImportConfig.mockResolvedValueOnce(error);

		const actual = await readConfigSettings("example.config.ts", ".", template);

		expect(actual).toBe(error);
	});

	it("returns a mismatch error when the imported config has a different template than the provided one", async () => {
		mockTryImportConfig.mockResolvedValueOnce(templateOther.createConfig());

		const actual = await readConfigSettings("example.config.ts", ".", template);

		expect(actual).toEqual(expect.any(Error));
	});

	it("returns a mismatch error when the imported config matches the provided template", async () => {
		const config = template.createConfig();
		mockTryImportConfig.mockResolvedValueOnce(config);

		const actual = await readConfigSettings("example.config.ts", ".", template);

		expect(actual).toBe(config);
	});
});
