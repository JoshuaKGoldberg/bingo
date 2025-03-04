import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";
import { inferPreset } from "./inferPreset.js";

const base = createBase({
	options: { name: z.string() },
});

const files = {
	a: "...",
	b: "...",
	c: "...",
	d: "...",
	e: "...",
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
	blocks: [
		base.createBlock({
			produce() {
				return {
					files: {
						a: "...",
					},
				};
			},
		}),
	],
});

const presetLowPercentageB = base.createPreset({
	about: { name: "Low Percentage B" },
	blocks: [
		base.createBlock({
			produce() {
				return {
					files: {
						b: "...",
					},
				};
			},
		}),
	],
});

const presetHighPercentage = base.createPreset({
	about: { name: "High Percentage" },
	blocks: [
		base.createBlock({
			produce() {
				return {
					files: {
						a: "...",
						b: "...",
					},
				};
			},
		}),
	],
});

const context = {
	files,
	options: {
		name: "...",
	},
};

describe("inferPreset", () => {
	it("returns undefined without erroring when a block throws an error", () => {
		const actual = inferPreset(context, [presetErrors]);

		expect(actual).toBe(undefined);
	});

	it("returns undefined when no preset has a 35% match", () => {
		const actual = inferPreset(context, [
			presetLowPercentageA,
			presetLowPercentageB,
		]);

		expect(actual).toBe(undefined);
	});

	it("returns the matching preset when a preset has a 35% match", () => {
		const actual = inferPreset(context, [
			presetLowPercentageA,
			presetLowPercentageB,
			presetHighPercentage,
		]);

		expect(actual).toBe("high-percentage");
	});
});
