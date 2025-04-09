import { IntakeFileEntry } from "bingo-fs";
import { createBase } from "bingo-stratum";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testIntake } from "./testIntake.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

describe("testIntake", () => {
	it("returns undefined when the Block doesn't define an intake", () => {
		const block = base.createBlock({
			addons: {
				value: z.string().optional(),
			},
			produce() {
				return {};
			},
		});

		const actual = testIntake(block, { files: {} });

		expect(actual).toBeUndefined();
	});

	it("returns the intake result when the Block defines an intake", () => {
		const block = base.createBlock({
			addons: {
				value: z.string().optional(),
			},
			intake({ files }) {
				return {
					value: (files["value.txt"] as IntakeFileEntry)[0],
				};
			},
			produce() {
				return {};
			},
		});

		const value = "abc";

		const actual = testIntake(block, {
			files: {
				"value.txt": [value],
			},
		});

		expect(actual).toEqual({ value });
	});

	describe("options", () => {
		const blockUsingOptions = base.createBlock({
			addons: {
				extra: z.string().optional(),
			},
			intake({ options }) {
				return {
					extra: options.value + "!",
				};
			},
			produce() {
				return {};
			},
		});

		it("throws an error when options isn't provided and a block uses options", () => {
			expect(() =>
				testIntake(blockUsingOptions, {
					files: {},
				}),
			).toThrowErrorMatchingInlineSnapshot(
				`[Error: Context property 'options' was used by the Block but not provided.]`,
			);
		});

		it("passes options to the block when provided", () => {
			const actual = testIntake(blockUsingOptions, {
				files: {},
				options: { preset: "test", value: "abc" },
			});

			expect(actual).toEqual({
				extra: "abc!",
			});
		});
	});
});
