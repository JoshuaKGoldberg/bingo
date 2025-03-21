import { describe, expect, it, vi } from "vitest";

import { getTemplatePackageData } from "./getTemplatePackageData.js";
import { resolveFilePath } from "./utils.js";

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

let isWindows = false;

vi.mock("node:url", async () => {
	const nodeUrl = await vi.importActual<typeof import("node:url")>("node:url");
	return {
		...nodeUrl,
		fileURLToPath: (url: string | URL) =>
			nodeUrl.fileURLToPath(url, { windows: isWindows }),
	};
});

vi.mock("./utils.ts", { spy: true });

const testPaths = {
	posix: {
		input: "/home/user/project/file.js",
		output: "/home/user/project/file.js",
		outputDir: "/home/user/project",
	},
	windows: {
		input: "/C:/Users/User/file.js",
		output: "C:\\Users\\User\\file.js",
		outputDir: "C:\\Users\\User",
	},
};

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

	it("returns an error when readPackageUp returns undefined on POSIX", async () => {
		isWindows = false;

		mockGetCallId.mockReturnValueOnce({ file: testPaths.posix.input });
		mockReadPackageUp.mockResolvedValueOnce(undefined);

		const actual = await getTemplatePackageData();

		expect(actual).toEqual(
			new Error(
				`Could not find a package.json relative to '${testPaths.posix.outputDir}'.`,
			),
		);
		expect(resolveFilePath).toHaveBeenCalledWith(testPaths.posix.input);
		expect(resolveFilePath).toHaveReturnedWith(testPaths.posix.output);
	});

	it("returns an error when readPackageUp returns undefined on Windows", async () => {
		isWindows = true;

		mockGetCallId.mockReturnValueOnce({ file: testPaths.windows.input });
		mockReadPackageUp.mockResolvedValueOnce(undefined);

		const actual = await getTemplatePackageData();

		expect(actual).toEqual(
			new Error(
				`Could not find a package.json relative to '${testPaths.windows.outputDir}'.`,
			),
		);
		expect(resolveFilePath).toHaveBeenCalledWith(testPaths.windows.input);
		expect(resolveFilePath).toHaveReturnedWith(testPaths.windows.output);
	});

	it("returns packageJson when readPackageUp finds a package.json on POSIX", async () => {
		isWindows = false;

		const mockPackageJson = { name: "test-package" };
		mockGetCallId.mockReturnValueOnce({ file: testPaths.posix.input });
		mockReadPackageUp.mockResolvedValueOnce({ packageJson: mockPackageJson });

		const actual = await getTemplatePackageData();

		expect(actual).toBe(mockPackageJson);
		expect(resolveFilePath).toHaveBeenCalledWith(testPaths.posix.input);
		expect(resolveFilePath).toHaveReturnedWith(testPaths.posix.output);
	});

	it("returns packageJson when readPackageUp finds a package.json on Windows", async () => {
		isWindows = true;

		const mockPackageJson = { name: "test-package" };
		mockGetCallId.mockReturnValueOnce({ file: testPaths.windows.input });
		mockReadPackageUp.mockResolvedValueOnce({ packageJson: mockPackageJson });

		const actual = await getTemplatePackageData();

		expect(actual).toBe(mockPackageJson);
		expect(resolveFilePath).toHaveBeenCalledWith(testPaths.windows.input);
		expect(resolveFilePath).toHaveReturnedWith(testPaths.windows.output);
	});
});

// fill in tests for this file
