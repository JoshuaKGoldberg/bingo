import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { tryImportAndInstallIfNecessary } from "./tryImportAndInstallIfNecessary.js";

const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	spinner: () => mockSpinner,
}));

const mockImportLocalOrNpx = vi.fn();

vi.mock("import-local-or-npx", () => ({
	get importLocalOrNpx() {
		return mockImportLocalOrNpx;
	},
}));

const errorLocal = new Error("Error: local");
const errorNpx = new Error("Error: npx");

describe("tryImportAndInstallIfNecessary", () => {
	it("resolves with the local error when importLocalOrNpx resolves with a failure for a local path", async () => {
		mockImportLocalOrNpx.mockResolvedValueOnce({
			kind: "failure",
			local: errorLocal,
			npx: errorNpx,
		});

		const actual = await tryImportAndInstallIfNecessary(
			"../create-my-app",
			true,
		);

		expect(actual).toBe(errorLocal);
		expect(mockSpinner.start.mock.calls).toEqual([
			[`Loading ${chalk.blue("../create-my-app")}`],
		]);
		expect(mockSpinner.stop.mock.calls).toEqual([
			[
				`Could not load ${chalk.blue("../create-my-app")}: ${chalk.red(errorLocal.message)}`,
				1,
			],
		]);
	});

	it("resolves with the npx error when importLocalOrNpx resolves with a failure for a package name", async () => {
		mockImportLocalOrNpx.mockResolvedValueOnce({
			kind: "failure",
			local: errorLocal,
			npx: errorNpx,
		});

		const actual = await tryImportAndInstallIfNecessary("bingo-my-app", true);

		expect(actual).toBe(errorNpx);
		expect(mockSpinner.start.mock.calls).toEqual([
			[`Loading ${chalk.blue("bingo-my-app")}`],
		]);
		expect(mockSpinner.stop.mock.calls).toEqual([
			[
				`Could not load ${chalk.blue("bingo-my-app")}: ${chalk.red(errorNpx.message)}`,
				1,
			],
		]);
	});

	it("resolves with the package when importLocalOrNpx resolves a package", async () => {
		const resolved = { happy: true };

		mockImportLocalOrNpx.mockResolvedValueOnce({
			kind: "local",
			resolved,
		});

		const actual = await tryImportAndInstallIfNecessary("bingo-my-app", true);

		expect(actual).toBe(resolved);
		expect(mockSpinner.start.mock.calls).toEqual([
			[`Loading ${chalk.blue("bingo-my-app")}`],
		]);
		expect(mockSpinner.stop.mock.calls).toEqual([
			[`Loaded ${chalk.blue("bingo-my-app")}`],
		]);
	});
});
