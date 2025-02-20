import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { readProductionSettings } from "./readProductionSettings.js";

const mockReaddir = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
}));

describe("readProductionSettings", () => {
	it("reads from directory '.' when a directory is not provided", async () => {
		mockReaddir.mockResolvedValueOnce([]);

		await readProductionSettings();

		expect(mockReaddir).toHaveBeenCalledWith(".");
	});

	it("reads from the directory when provided", async () => {
		const directory = "./other";
		mockReaddir.mockResolvedValueOnce([]);

		await readProductionSettings({ directory });

		expect(mockReaddir).toHaveBeenCalledWith(directory);
	});

	it("returns mode: setup when the directory does not exist and mode is not provided", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
		});

		expect(actual).toEqual({ mode: "setup" });
	});

	it("returns mode: setup when the directory does not exist and mode is setup", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
			mode: "setup",
		});

		expect(actual).toEqual({ mode: "setup" });
	});

	it("returns an error when the directory does not exist and mode is transition", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
			mode: "transition",
		});

		expect(actual).toEqual(
			new Error(
				"Cannot run with --mode transition on a directory that does not yet exist.",
			),
		);
	});

	it("returns mode: setup when only a config file with a mismatched name is found without a mode", async () => {
		mockReaddir.mockResolvedValueOnce(["mismatched.config.ts"]);

		const actual = await readProductionSettings({
			from: "create-example",
		});

		expect(actual).toEqual({ mode: "setup" });
	});

	it("returns the config file and mode: transition when a config file is found without a mode", async () => {
		const configFile = "create-example.config.ts";
		mockReaddir.mockResolvedValueOnce([configFile]);

		const actual = await readProductionSettings({
			from: "create-example",
		});

		expect(actual).toEqual({ configFile, mode: "transition" });
	});

	it("returns the config file relative to the directory when a config file is found with a directory", async () => {
		const configFile = "create-example.config.ts";
		mockReaddir.mockResolvedValueOnce([configFile]);

		const actual = await readProductionSettings({
			directory: "path/to",
			from: "create-example",
		});

		expect(actual).toEqual({
			configFile: path.join("path/to", configFile),
			mode: "transition",
		});
	});

	it("returns mode transition when only a .git is is found with mode transition", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings({ mode: "transition" });

		expect(actual).toEqual({ mode: "transition" });
	});

	it("returns mode setup when only a .git is is found with mode setup", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings({ mode: "setup" });

		expect(actual).toEqual({ mode: "setup" });
	});

	it("returns mode transition when only a .git is is found without a mode", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ mode: "transition" });
	});

	it("returns mode setup when no config file or .git is found without a mode", async () => {
		mockReaddir.mockResolvedValueOnce([]);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ mode: "setup" });
	});
});
