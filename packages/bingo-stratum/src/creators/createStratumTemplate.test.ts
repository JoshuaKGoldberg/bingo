import { awaitLazyProperties } from "bingo";
import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";

const mockInferPreset = vi.fn();

vi.mock("./inferPreset.js", () => ({
	get inferPreset() {
		return mockInferPreset;
	},
}));

const base = createBase({
	options: { name: z.string() },
});

const preset = base.createPreset({
	about: { name: "Example" },
	blocks: [],
});

const template = base.createStratumTemplate({
	presets: [preset],
});

const mockLog = vi.fn();

const mockOptions = { name: "Test Name" };

describe("createStratumTemplate", () => {
	describe("options", () => {
		describe("--preset", () => {
			it("does not call inferPreset when context.files is not provided", async () => {
				const lazyOptions = template.prepare({
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				await awaitLazyProperties(lazyOptions);

				expect(mockInferPreset).not.toHaveBeenCalled();
			});

			it("does not display a log when inferPreset returns undefined", async () => {
				mockInferPreset.mockReturnValueOnce(undefined);

				const lazyOptions = template.prepare({
					files: {
						"README.md": "...",
					},
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				await awaitLazyProperties(lazyOptions);

				expect(mockLog).not.toHaveBeenCalled();
			});

			it("displays a log when inferPreset returns a preset", async () => {
				mockInferPreset.mockReturnValueOnce("example");

				const lazyOptions = template.prepare({
					files: {
						"README.md": "...",
					},
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				await awaitLazyProperties(lazyOptions);

				expect(mockLog).toHaveBeenCalledWith(
					`Detected ${chalk.blue(`--preset example`)} from existing files on disk.`,
				);
			});
		});
	});
});
