import { createBase } from "bingo-stratum";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testBlock } from "./testBlock.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

const blockStandalone = base.createBlock({
	produce() {
		return {
			files: {
				"value.txt": "abc",
			},
		};
	},
});

describe("testBlock", () => {
	it("doesn't throw an error when settings isn't provided and the block uses no settings", () => {
		const actual = testBlock(blockStandalone);

		expect(actual).toEqual({ files: { "value.txt": "abc" } });
	});

	it("doesn't throw an error when settings is {} and the block uses no settings", () => {
		const actual = testBlock(blockStandalone, {});

		expect(actual).toEqual({ files: { "value.txt": "abc" } });
	});

	describe("addons", () => {
		const blockUsingAddons = base.createBlock({
			addons: {
				value: z.string().optional(),
			},
			produce({ addons }) {
				return {
					files: {
						"value.txt": addons.value ?? "default",
					},
				};
			},
		});

		it("does not throws an error when addons isn't provided and a block uses addons", () => {
			const actual = testBlock(blockUsingAddons, {});

			expect(actual).toMatchInlineSnapshot(`
				{
				  "files": {
				    "value.txt": "default",
				  },
				}
			`);
		});

		it("passes addons to the block when provided", () => {
			const actual = testBlock(blockUsingAddons, {
				addons: { value: "abc" },
			});

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});

	describe("options", () => {
		const blockUsingOptions = base.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		it("throws an error when options isn't provided and a block uses options", () => {
			expect(() =>
				testBlock(blockUsingOptions),
			).toThrowErrorMatchingInlineSnapshot(
				`[Error: Context property 'options' was used by the Block but not provided.]`,
			);
		});

		it("passes options to the block when provided", () => {
			const actual = testBlock(blockUsingOptions, {
				options: { value: "abc" },
			});

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});
});
