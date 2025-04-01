import { beforeEach, describe, expect, it, vi } from "vitest";

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

let isWindowsPaths = false;

vi.mock("node:url", async () => {
	const nodeUrl = await vi.importActual<typeof import("node:url")>("node:url");
	return {
		...nodeUrl,
		fileURLToPath: (url: string | URL) =>
			nodeUrl.fileURLToPath(url, { windows: isWindowsPaths }),
	};
});

vi.mock("node:path", async () => {
	const nodePathWindows =
		await vi.importActual<typeof import("node:path/win32")>("node:path/win32");
	const nodePathPosix =
		await vi.importActual<typeof import("node:path/posix")>("node:path/posix");
	return {
		default: {
			...(await vi.importActual("node:path")),
			dirname: (path: string) =>
				isWindowsPaths
					? nodePathWindows.dirname(path)
					: nodePathPosix.dirname(path),
		},
	};
});

const testPaths = {
	posix: {
		input: "/home/user/project/file.js",
		output: "/home/user/project",
	},
	windows: {
		input: "/C:/Users/User/file.js",
		output: "C:\\Users\\User",
	},
};

describe("getTemplatePackageData", () => {
	beforeEach(() => {
		isWindowsPaths = false;
		vi.resetAllMocks();
	});

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
		mockGetCallId.mockReturnValueOnce({ file: testPaths.posix.input });
		mockReadPackageUp.mockResolvedValueOnce(undefined);

		const actual = await getTemplatePackageData();

		expect(actual).toEqual(
			new Error(
				`Could not find a package.json relative to '${testPaths.posix.output}'.`,
			),
		);
	});

	it("returns an error when readPackageUp returns undefined on Windows", async () => {
		isWindowsPaths = true;

		mockGetCallId.mockReturnValueOnce({ file: testPaths.windows.input });
		mockReadPackageUp.mockResolvedValueOnce(undefined);

		const actual = await getTemplatePackageData();

		expect(actual).toEqual(
			new Error(
				`Could not find a package.json relative to '${testPaths.windows.output}'.`,
			),
		);
	});

	it("returns packageJson when readPackageUp finds a package.json", async () => {
		const mockPackageJson = { name: "test-package" };
		mockGetCallId.mockReturnValueOnce({ file: testPaths.posix.input });
		mockReadPackageUp.mockResolvedValueOnce({ packageJson: mockPackageJson });

		const actual = await getTemplatePackageData();

		expect(actual).toBe(mockPackageJson);
	});
});

// fill in tests for this file
