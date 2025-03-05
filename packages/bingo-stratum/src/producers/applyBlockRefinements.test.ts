import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { applyBlockRefinements } from "./applyBlockRefinements.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

const blockA = base.createBlock({
	about: { name: "A" },
	produce: vi.fn(),
});

const blockB = base.createBlock({
	about: { name: "B" },
	produce: vi.fn(),
});

const blockC = base.createBlock({
	about: { name: "C" },
	produce: vi.fn(),
});

describe("applyBlockRefinements", () => {
	it("returns the initial blocks when no exclusion options or refinements are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(initial, { value: "" });

		expect(actual).toBe(initial);
	});

	it("returns the initial blocks when no exclusion options are provided and refinements are empty", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			initial,
			{ value: "" },
			{ add: [], exclude: [] },
		);

		expect(actual).toBe(initial);
	});

	it("returns modified blocks when only exclusion options are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			initial,
			{ "exclude-a": true, value: "" },
			{
				add: [],
				exclude: [],
			},
		);

		expect(actual).toEqual([blockB]);
	});

	it("returns modified blocks when only refinements are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			initial,
			{ value: "" },
			{
				add: [blockC],
				exclude: [blockB],
			},
		);

		expect(actual).toEqual([blockA, blockC]);
	});

	it("returns modified blocks when both exclusion options and refinements are provided", () => {
		const initial = [blockA, blockB, blockC];

		const actual = applyBlockRefinements(
			initial,
			{ "exclude-a": true, value: "" },
			{
				add: [],
				exclude: [blockB],
			},
		);

		expect(actual).toEqual([blockC]);
	});
});
