import { describe, expect, it, vi } from "vitest";

import { getForkedTemplateLocator } from "./getForkedTemplateLocator.js";

const mockFromUrl = vi.fn();

vi.mock("hosted-git-info", () => ({
	default: {
		get fromUrl() {
			return mockFromUrl;
		},
	},
}));

const mockReadPackage = vi.fn();

vi.mock("read-pkg", () => ({
	get readPackage() {
		return mockReadPackage;
	},
}));

const template = {
	owner: "TestOwner",
	repository: "test-repository",
};

describe("getForkedTemplateLocator", () => {
	it("returns undefined when there is no package repository url", async () => {
		mockReadPackage.mockResolvedValueOnce({});

		const actual = await getForkedTemplateLocator(".", template);

		expect(actual).toBeUndefined();
		expect(mockFromUrl).not.toHaveBeenCalled();
	});

	it("returns undefined when the Git repository doesn't have information", async () => {
		mockReadPackage.mockResolvedValueOnce({
			repository: { url: "..." },
		});

		mockFromUrl.mockResolvedValueOnce(undefined);

		const actual = await getForkedTemplateLocator(".", template);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the Git repository user doesn't match the template owner", async () => {
		mockReadPackage.mockResolvedValueOnce({
			repository: { url: "..." },
		});

		mockFromUrl.mockResolvedValueOnce({
			project: template.repository,
			user: "other",
		});

		const actual = await getForkedTemplateLocator(".", template);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the Git repository project doesn't match the template repository", async () => {
		mockReadPackage.mockResolvedValueOnce({
			repository: { url: "..." },
		});

		mockFromUrl.mockResolvedValueOnce({
			project: "other",
			user: template.owner,
		});

		const actual = await getForkedTemplateLocator(".", template);

		expect(actual).toBeUndefined();
	});

	it("returns a locator when the Git repository matches the template repository", async () => {
		mockReadPackage.mockResolvedValueOnce({
			repository: { url: "..." },
		});

		mockFromUrl.mockResolvedValueOnce({
			project: template.repository,
			user: template.owner,
		});

		const actual = await getForkedTemplateLocator(".", template);

		expect(actual).toBe(`TestOwner/test-repository`);
	});
});
