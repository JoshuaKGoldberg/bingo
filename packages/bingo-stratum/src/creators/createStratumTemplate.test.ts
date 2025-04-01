import { allPropertiesLazy } from "all-properties-lazy";
import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { BaseOptionsFor } from "../types/bases.js";
import { createBase } from "./createBase.js";

const mockInferExistingBlocks = vi.fn();

vi.mock("./inferExistingBlocks.js", () => ({
	get inferExistingBlocks() {
		return mockInferExistingBlocks;
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
	describe("blocks", () => {
		it("adds extra blocks alongside those from presets when the template definition includes them", () => {
			const blockInsidePreset = base.createBlock({
				about: { name: "Block From Preset" },
				produce: vi.fn(),
			});
			const blockOutsidePreset = base.createBlock({
				about: { name: "Block Outside Preset" },
				produce: vi.fn(),
			});

			const template = base.createStratumTemplate({
				blocks: [blockOutsidePreset],
				presets: [
					base.createPreset({
						about: { name: "Example Preset" },
						blocks: [blockInsidePreset],
					}),
				],
			});

			expect(template.blocks).toEqual([blockOutsidePreset, blockInsidePreset]);
		});
	});

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
				"add-example-block",
				"exclude-example-block",
			]);
		});

		describe("inference", () => {
			const templateWithPreset = base.createStratumTemplate({
				presets: [preset],
			});

			it("does not call inferExistingBlocks when context.files is not provided", async () => {
				const lazyOptions = templateWithPreset.prepare({
					log: mockLog,
					options: mockOptions,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockInferExistingBlocks).not.toHaveBeenCalled();
				expect(options).toEqual({});
			});

			it("does not display a log when inferExistingBlocks returns no blocks or preset", async () => {
				mockInferExistingBlocks.mockReturnValueOnce({
					blocks: [],
					preset: undefined,
				});

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

			it("does not display a log when inferExistingBlocks infers a block that was explicitly excluded", async () => {
				mockInferExistingBlocks.mockReturnValueOnce({
					blocks: [],
					preset: undefined,
				});

				const lazyOptions = templateWithPreset.prepare({
					files: {
						"README.md": "...",
					},
					log: mockLog,
					options: {
						...mockOptions,
						"exclude-a": true,
					} as typeof mockOptions,
					take: vi.fn(),
				});

				const options = await allPropertiesLazy(lazyOptions);

				expect(mockLog).not.toHaveBeenCalled();
				expect(options).toEqual({});
			});

			it("displays a log when inferExistingBlocks infers one block", async () => {
				const blockA = base.createBlock({
					about: { name: "A" },
					produce: vi.fn(),
				});
				mockInferExistingBlocks.mockReturnValueOnce({
					blocks: [blockA],
					preset: undefined,
				});

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
					`Detected ${chalk.blue(`--add-a`)} from existing files on disk.`,
				);
				expect(options).toEqual({ "add-a": true });
			});

			it("displays a log when inferExistingBlocks infers two blocks", async () => {
				const blockA = base.createBlock({
					about: { name: "A" },
					produce: vi.fn(),
				});
				const blockB = base.createBlock({
					about: { name: "B" },
					produce: vi.fn(),
				});
				mockInferExistingBlocks.mockReturnValueOnce({
					blocks: [blockA, blockB],
					preset: undefined,
				});

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
					`Detected ${chalk.blue(`--add-a`)} ${chalk.blue(`--add-b`)} from existing files on disk.`,
				);
				expect(options).toEqual({
					"add-a": true,
					"add-b": true,
				});
			});

			it("displays a log when inferExistingBlocks infers a preset", async () => {
				const presetName = "example";
				mockInferExistingBlocks.mockReturnValueOnce({
					blocks: [],
					preset: presetName,
				});

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
