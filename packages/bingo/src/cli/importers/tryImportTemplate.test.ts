import { describe, expect, it, vi } from "vitest";

import { tryImportTemplate } from "./tryImportTemplate.js";

const mockTryImportWithPredicate = vi.fn();

vi.mock("../tryImportWithPredicate.js", () => ({
	get tryImportWithPredicate() {
		return mockTryImportWithPredicate;
	},
}));

describe("tryImportTemplate", () => {
	it("returns the error when tryImportWithPredicate resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryImportWithPredicate.mockResolvedValueOnce(error);

		const actual = await tryImportTemplate("bingo-my-app");

		expect(actual).toEqual(error);
	});

	it("returns the template when tryImportWithPredicate resolves with a template", async () => {
		const template = { isTemplate: true };

		mockTryImportWithPredicate.mockResolvedValueOnce(template);

		const actual = await tryImportTemplate("bingo-my-app");

		expect(actual).toEqual(template);
	});
});
