import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { createSystemContext } from "./createSystemContext.js";

const mockOfflineFetchers = {
	variant: "offline",
};

const mockSystemFetchers = {
	variant: "system",
};

const mockSystemRunner = vi.fn();

const mockWritingFileSystem = {
	readDirectory: vi.fn(),
	readFile: vi.fn(),
	writeDirectory: vi.fn(),
	writeFile: vi.fn(),
};

vi.mock("bingo-systems", () => ({
	createSystemFetchers: () => mockSystemFetchers,
	createSystemFetchersOffline: () => mockOfflineFetchers,
	createSystemRunner: () => mockSystemRunner,
	createWritingFileSystem: () => mockWritingFileSystem,
}));

const mockDisplay = {
	item: vi.fn(),
	log: vi.fn(),
};

vi.mock("./createDisplay.js", () => ({
	createDisplay: () => mockDisplay,
}));

describe("createSystemContext", () => {
	describe("display", () => {
		it("uses the provided display when it exists", () => {
			const provided = {
				item: vi.fn(),
				log: vi.fn(),
			};

			const { display } = createSystemContext({
				directory: ".",
				display: provided,
			});

			expect(display).toBe(provided);
		});

		it("creates a system display when display is not provided", () => {
			const { display } = createSystemContext({ directory: "." });

			expect(display).toBe(mockDisplay);
		});
	});

	describe("fetchers", () => {
		it("uses the provided fetchers when it exists", () => {
			const provided = {
				fetch: vi.fn(),
				octokit: {} as Octokit,
			};

			const { fetchers } = createSystemContext({
				directory: ".",
				fetchers: provided,
			});

			expect(fetchers).toBe(provided);
		});

		it("creates standard fetchers when fetchers and offline are not provided", () => {
			const { fetchers } = createSystemContext({ directory: "." });

			expect(fetchers).toBe(mockSystemFetchers);
		});

		it("creates offline fetchers when fetchers is not provided and offline is true", () => {
			const { fetchers } = createSystemContext({
				directory: ".",
				offline: true,
			});

			expect(fetchers).toBe(mockOfflineFetchers);
		});
	});

	describe("fs", () => {
		it("uses the provided fs when it exists", () => {
			const provided = {
				readDirectory: vi.fn(),
				readFile: vi.fn(),
				writeDirectory: vi.fn(),
				writeFile: vi.fn(),
			};

			const { fs } = createSystemContext({
				directory: ".",
				fs: provided,
			});

			expect(fs).toBe(provided);
		});

		it("creates a writing file system when fs is not provided", () => {
			const { fs } = createSystemContext({ directory: "." });

			expect(fs).toBe(mockWritingFileSystem);
		});
	});

	describe("runner", () => {
		it("uses the provided runner when it exists", () => {
			const provided = vi.fn();

			const { runner } = createSystemContext({
				directory: ".",
				runner: provided,
			});

			expect(runner).toBe(provided);
		});

		it("creates a writing file system when runner is not provided", () => {
			const { runner } = createSystemContext({ directory: "." });

			expect(runner).toBe(mockSystemRunner);
		});
	});
});
