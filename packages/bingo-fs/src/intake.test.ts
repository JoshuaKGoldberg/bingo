import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { intake } from "./intake.js";

const mockReaddir = vi.fn();
const mockReadFile = vi.fn();
const mockStat = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
	get readFile() {
		return mockReadFile;
	},
	get stat() {
		return mockStat;
	},
}));

const normalizeCallsPaths = (calls: string[][]) => {
	return calls.map((call) => call.map((arg) => path.normalize(arg)));
};

describe("intake", () => {
	it("returns undefined when nothing exists under the path", async () => {
		mockStat.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await intake("from");

		expect(actual).toEqual(undefined);
		expect(mockReaddir).not.toHaveBeenCalled();
		expect(mockStat).toHaveBeenCalledOnce();
	});

	it("returns the file contents when given a path to a file", async () => {
		const contents = "abc123";

		mockReadFile.mockResolvedValueOnce(contents);
		mockStat.mockResolvedValueOnce({
			isDirectory: () => false,
			mode: "000",
		});

		const actual = await intake("from");

		expect(actual).toEqual([contents, { executable: false }]);
		expect(mockReaddir).not.toHaveBeenCalled();
		expect(mockStat).toHaveBeenCalledOnce();
	});

	it("returns an empty object when given a path to a directory with no files", async () => {
		mockReaddir.mockResolvedValueOnce([]);
		mockStat.mockResolvedValueOnce({ isDirectory: () => true });

		const actual = await intake("from");

		expect(actual).toEqual({});
		expect(mockReaddir.mock.calls).toEqual([["from"]]);
		expect(mockStat).toHaveBeenCalledOnce();
	});

	it("returns directory files when given a path to a directory with files", async () => {
		mockReaddir.mockResolvedValueOnce(["included-a", "included-b"]);
		mockReadFile
			.mockResolvedValueOnce("contents-a")
			.mockResolvedValueOnce("contents-b");
		mockStat
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 0x644,
			})
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 0x755,
			});

		const actual = await intake("from");

		expect(actual).toEqual({
			"included-a": ["contents-a", { executable: false }],
			"included-b": ["contents-b", { executable: true }],
		});
		expect(mockReaddir.mock.calls).toEqual([["from"]]);

		const normalizedStatCalls = normalizeCallsPaths([
			["from"],
			["from/included-a"],
			["from/included-b"],
		]);
		expect(mockStat.mock.calls).toEqual(normalizedStatCalls);
	});

	it("returns non-excluded files when given a path to a directory with files and excludes is provided", async () => {
		mockReaddir.mockResolvedValueOnce(["excluded", "included-a", "included-b"]);
		mockReadFile
			.mockResolvedValueOnce("contents-a")
			.mockResolvedValueOnce("contents-b");
		mockStat
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 0x644,
			})
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 0x755,
			});

		const actual = await intake("from", {
			exclude: /excluded/,
		});

		expect(actual).toEqual({
			"included-a": ["contents-a", { executable: false }],
			"included-b": ["contents-b", { executable: true }],
		});
		expect(mockReaddir.mock.calls).toEqual([["from"]]);

		const normalizedStatCalls = normalizeCallsPaths([
			["from"],
			["from/included-a"],
			["from/included-b"],
		]);
		expect(mockStat.mock.calls).toEqual(normalizedStatCalls);
	});

	it("returns a nested file when given a path to a directory with a nested directory", async () => {
		mockReaddir
			.mockResolvedValueOnce(["middle"])
			.mockResolvedValueOnce(["excluded", "included"]);
		mockReadFile.mockResolvedValueOnce("contents");
		mockStat
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 0x644,
			});

		const actual = await intake("from", {
			exclude: /excluded/,
		});

		expect(actual).toEqual({
			middle: {
				included: ["contents", { executable: false }],
			},
		});

		const normalizedReaddirCalls = normalizeCallsPaths([
			["from"],
			["from/middle"],
		]);
		expect(mockReaddir.mock.calls).toEqual(normalizedReaddirCalls);

		const normalizedStatCalls = normalizeCallsPaths([
			["from"],
			["from/middle"],
			["from/middle/included"],
		]);
		expect(mockStat.mock.calls).toEqual(normalizedStatCalls);
	});
});
