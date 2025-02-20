import { describe, expect, it, vi } from "vitest";

import { getTemplatePackageData } from "./getTemplatePackageData.js";

const mockGetCallId = vi.fn();

vi.mock("call-id", () => ({
	get getCallId() {
		return mockGetCallId;
	},
}));

const mockReadPackageUp = vi.fn();

vi.mock("read-package-up", () => ({
	get readPackageUp() {
		return mockReadPackageUp;
	},
}));

describe("getTemplatePackageData", () => {
	it("returns an error when getCallId returns undefined", async () => {
		mockGetCallId.mockReturnValueOnce(undefined);

		const actual = await getTemplatePackageData();

		expect(actual).toEqual(
			new Error(
				"Could not determine what directory this Bingo CLI is being called from.",
			),
		);
	});

	describe("getTemplatePackageData", () => {
		it("returns an error when getCallId returns undefined", async () => {
			mockGetCallId.mockReturnValueOnce(undefined);

			const actual = await getTemplatePackageData();

			expect(actual).toEqual(
				new Error(
					"Could not determine what directory this Bingo CLI is being called from.",
				),
			);
		});

		it("returns an error when readPackageUp returns undefined", async () => {
			mockGetCallId.mockReturnValueOnce({ file: "/path/to/file.js" });
			mockReadPackageUp.mockResolvedValueOnce(undefined);

			const actual = await getTemplatePackageData();

			expect(actual).toEqual(
				new Error("Could not find a package.json relative to '/path/to'."),
			);
		});

		it("returns packageJson when readPackageUp finds a package.json", async () => {
			const mockPackageJson = { name: "test-package" };
			mockGetCallId.mockReturnValueOnce({ file: "/path/to/file.js" });
			mockReadPackageUp.mockResolvedValueOnce({ packageJson: mockPackageJson });

			const actual = await getTemplatePackageData();

			expect(actual).toBe(mockPackageJson);
		});
	});
});

// fill in tests for this file
