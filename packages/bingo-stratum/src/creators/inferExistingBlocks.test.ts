import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";
import { inferExistingBlocks } from "./inferExistingBlocks.js";

const base = createBase({
	options: { name: z.string() },
});

const blockA = base.createBlock({
	about: { name: "A" },
	produce() {
		return {
			files: {
				a: "...",
			},
		};
	},
});

const blockB = base.createBlock({
	about: { name: "B" },
	produce() {
		return {
			files: {
				b: "...",
			},
		};
	},
});

const blockAB = base.createBlock({
	produce() {
		return {
			files: {
				a: "...",
				b: "...",
			},
		};
	},
});

describe("inferPreset", () => {
	describe("blocks", () => {
		it("returns no blocks when no blocks match", () => {
			const presetA = base.createPreset({
				about: { name: "A" },
				blocks: [blockA],
			});

			const context = {
				files: {
					b: "...",
				},
				options: {
					name: "...",
				},
			};

			const template = base.createStratumTemplate({
				presets: [presetA],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.blocks).toEqual([]);
		});

		it("returns no blocks when a block only partially matches", () => {
			const presetAB = base.createPreset({
				about: { name: "AB" },
				blocks: [blockAB],
			});

			const context = {
				files: {
					a: "...",
				},
				options: {
					name: "...",
				},
			};

			const template = base.createStratumTemplate({
				presets: [presetAB],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.blocks).toEqual([]);
		});

		it("returns the block when one block from a preset matches", () => {
			const presetA = base.createPreset({
				about: { name: "A" },
				blocks: [blockA],
			});

			const context = {
				files: {
					a: "...",
				},
				options: {
					name: "...",
				},
			};

			const template = base.createStratumTemplate({
				presets: [presetA],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.blocks).toEqual([blockA]);
		});

		it("returns the block when one block out of a preset matches", () => {
			const presetA = base.createPreset({
				about: { name: "A" },
				blocks: [blockA],
			});

			const context = {
				files: {
					b: "...",
				},
				options: {
					name: "...",
				},
			};

			const template = base.createStratumTemplate({
				blocks: [blockB],
				presets: [presetA],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.blocks).toEqual([blockB]);
		});

		it("returns the blocks when two blocks match", () => {
			const presetA = base.createPreset({
				about: { name: "A" },
				blocks: [blockA],
			});

			const context = {
				files: {
					a: "...",
					b: "...",
				},
				options: {
					name: "...",
				},
			};

			const template = base.createStratumTemplate({
				blocks: [blockB],
				presets: [presetA],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.blocks).toEqual([blockB, blockA]);
		});
	});

	describe("preset", () => {
		const files = {
			a: "...",
			b: "...",
			c: "...",
			d: "...",
			e: "...",
		};

		const context = {
			files,
			options: {
				name: "...",
			},
		};

		const presetErrors = base.createPreset({
			about: { name: "Errors" },
			blocks: [
				base.createBlock({
					produce() {
						throw new Error("Oh no!");
					},
				}),
			],
		});

		const presetLowPercentageA = base.createPreset({
			about: { name: "Low Percentage A" },
			blocks: [blockA],
		});

		const presetLowPercentageB = base.createPreset({
			about: { name: "Low Percentage B" },
			blocks: [blockB],
		});

		const presetHighPercentage = base.createPreset({
			about: { name: "High Percentage" },
			blocks: [blockAB],
		});

		it("infers no preset without erroring when a block throws an error", () => {
			const template = base.createStratumTemplate({
				presets: [presetErrors],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.preset).toBeUndefined();
		});

		it("infers no preset when no preset has a 35% match", () => {
			const template = base.createStratumTemplate({
				presets: [presetLowPercentageA, presetLowPercentageB],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.preset).toBeUndefined();
		});

		it("infers the matching preset when a preset has a 35% match", () => {
			const template = base.createStratumTemplate({
				presets: [
					presetLowPercentageA,
					presetLowPercentageB,
					presetHighPercentage,
				],
			});

			const actual = inferExistingBlocks(context, template);

			expect(actual.preset).toBe("high-percentage");
		});
	});
});
