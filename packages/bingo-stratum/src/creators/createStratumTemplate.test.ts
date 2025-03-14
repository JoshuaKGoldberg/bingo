import { allPropertiesLazy } from "all-properties-lazy";
import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { BaseOptionsFor } from "../types/bases.js";
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
const mockLog = vi.fn();

const mockOptions = { name: "Test Name" };

describe("createStratumTemplate", () => {
	describe("options", () => {
		it("does not add block exclusion options when no blocks are named", () => {
			const template = base.createStratumTemplate({
				presets: [
					base.createPreset({
						about: { name: "Example" },
						blocks: [base.createBlock({ produce: vi.fn() })],
					}),
				],
			});

			expect(Object.keys(template.options)).toEqual(["name", "preset"]);
		});

		it("adds a block exclusion option when a block is named", () => {
			const template = base.createStratumTemplate({
				presets: [
					base.createPreset({
						about: { name: "Example Preset" },
						blocks: [
							base.createBlock({
								about: { name: "Example Block" },
								produce: vi.fn(),
							}),
						],
					}),
				],
			});

			expect(Object.keys(template.options)).toEqual([
				"name",
				"preset",
				"exclude-example-block",
			]);
		});

		describe("--preset", () => {
			const templateWithPreset = base.createStratumTemplate({
				presets: [preset],
			});

			it("does not call inferPreset when context.files is not provided", async () => {
				const lazyOptions = templateWithPreset.prepare({
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockInferPreset).not.toHaveBeenCalled();
				expect(options).toEqual({});
			});

			it("does not call inferPreset when a preset option is manually provided", async () => {
				const preset = "example";
				const lazyOptions = templateWithPreset.prepare({
					log: mockLog,
					// TODO: why is this type assertion necessary?
					// https://github.com/JoshuaKGoldberg/bingo/issues/287
					options: { ...mockOptions, preset } as BaseOptionsFor<typeof base>,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockInferPreset).not.toHaveBeenCalled();
				expect(options).toEqual({ preset });
			});

			it("does not display a log when inferPreset returns undefined", async () => {
				mockInferPreset.mockReturnValueOnce(undefined);

				const lazyOptions = templateWithPreset.prepare({
					files: {
						"README.md": "...",
					},
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockLog).not.toHaveBeenCalled();
				expect(options).toEqual({});
			});

			it("displays a log when inferPreset returns a preset", async () => {
				const presetName = "example";
				mockInferPreset.mockReturnValueOnce(presetName);

				const lazyOptions = templateWithPreset.prepare({
					files: {
						"README.md": "...",
					},
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockLog).toHaveBeenCalledWith(
					`Detected ${chalk.blue(`--preset example`)} from existing files on disk.`,
				);
				expect(options).toEqual({ preset: presetName });
			});
		});
	});
});
