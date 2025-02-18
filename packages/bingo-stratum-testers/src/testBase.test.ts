import { createInput } from "bingo";
import { createBase } from "bingo-stratum";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { testBase } from "./testBase.js";

const baseWithNoProduce = createBase({
	options: {
		value: z.string(),
	},
});

const baseWithValueHardcoded = createBase({
	options: {
		value: z.string(),
	},
	prepare() {
		return {
			value: "hardcoded",
		};
	},
});

describe("testBase", () => {
	it("doesn't throw an error when the Base has no produce and settings isn't provided", async () => {
		const actual = await testBase(baseWithNoProduce);

		expect(actual).toEqual(undefined);
	});

	it("doesn't throw an error when the Base has no produce and settings is {}", async () => {
		const actual = await testBase(baseWithNoProduce, {});

		expect(actual).toEqual(undefined);
	});

	it("doesn't throw an error when the Base has a produce that does not use settings and settings isn't provided", async () => {
		const actual = await testBase(baseWithValueHardcoded);

		expect(actual).toEqual({ value: "hardcoded" });
	});

	it("doesn't throw an error when the Base has a produce that does not use settings and settings is {}", async () => {
		const actual = await testBase(baseWithValueHardcoded, {});

		expect(actual).toEqual({ value: "hardcoded" });
	});

	describe("options", () => {
		const baseWithValueFromOptions = createBase({
			options: {
				value: z.string(),
			},
			prepare({ options }) {
				return {
					value: options.value ?? "default",
				};
			},
		});

		it("returns the options directly when the Base has no produce", async () => {
			const actual = await testBase(baseWithNoProduce, {
				options: { value: "direct" },
			});

			expect(actual).toEqual({ value: "direct" });
		});

		it("throws an error when the Base produce uses options and settings does not contain options", async () => {
			await expect(
				async () => await testBase(baseWithValueFromOptions, {}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'options' was used by the Base but not provided.]`,
			);
		});

		it("uses options when the Base produce uses options and settings contains options", async () => {
			const actual = await testBase(baseWithValueFromOptions, {
				options: { value: "override" },
			});

			expect(actual).toEqual({ value: "override" });
		});
	});

	describe("take", () => {
		const constant = "abc123";
		const inputConstant = createInput({
			produce: () => constant,
		});

		const baseWithValueFromInput = createBase({
			options: {
				value: z.string(),
			},
			prepare({ take }) {
				return {
					value: () => take(inputConstant),
				};
			},
		});

		it("throws an error when the Base produce uses take and settings does not include take", async () => {
			await expect(async () =>
				testBase(baseWithValueFromInput, { options: { value: "unused" } }),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'take' was used by the Base but not provided.]`,
			);
		});

		it("uses the provide take when the Base produce uses take and settings includes take", async () => {
			const take = vi.fn().mockReturnValueOnce("taken");

			const actual = await testBase(baseWithValueFromInput, { take });

			expect(actual).toEqual({ value: "taken" });
			expect(take).toHaveBeenCalledWith(inputConstant);
		});
	});
});
