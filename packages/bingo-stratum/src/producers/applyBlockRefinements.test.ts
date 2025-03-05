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
	it("returns the initial blocks when no modifications are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(initial);

		expect(actual).toBe(initial);
	});

	it("returns the initial blocks when modifications are empty", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(initial, { add: [], exclude: [] });

		expect(actual).toBe(initial);
	});

	it("applies modifications when they exist", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(initial, {
			add: [blockC],
			exclude: [blockB],
		});

		expect(actual).toEqual([blockA, blockC]);
	});
});
