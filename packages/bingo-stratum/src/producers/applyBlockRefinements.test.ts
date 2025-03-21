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

const blocksAvailable = [blockA, blockB, blockC];

describe("applyBlockRefinements", () => {
	it("returns the initial blocks when no exclusion options or refinements are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(blocksAvailable, initial, {
			value: "",
		});

		expect(actual).toBe(initial);
	});

	it("returns the initial blocks when no exclusion options are provided and refinements are empty", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			blocksAvailable,
			initial,
			{ value: "" },
			{ add: [], exclude: [] },
		);

		expect(actual).toBe(initial);
	});

	it("returns added and initial blocks when only addition options are provided", () => {
		const blocksInitial = [blockB];

		const actual = applyBlockRefinements(
			blocksAvailable,
			blocksInitial,
			{ "add-a": true, value: "" },
			{
				add: [],
				exclude: [],
			},
		);

		expect(actual).toEqual([blockB, blockA]);
	});

	it("returns non-excluded blocks when only exclusion options are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			blocksAvailable,
			initial,
			{ "exclude-a": true, value: "" },
			{
				add: [],
				exclude: [],
			},
		);

		expect(actual).toEqual([blockB]);
	});

	it("returns added and non-excluded blocks when addition and exclusion options are provided", () => {
		const initial = [blockB, blockC];

		const actual = applyBlockRefinements(
			blocksAvailable,
			initial,
			{ "add-a": true, "exclude-b": true, value: "" },
			{
				add: [],
				exclude: [],
			},
		);

		expect(actual).toEqual([blockC, blockA]);
	});

	it("throws an error when options both add and remove a block", () => {
		const initial = [blockB, blockC];

		const act = () =>
			applyBlockRefinements(
				blocksAvailable,
				initial,
				{ "add-a": true, "exclude-a": true, value: "" },
				{
					add: [],
					exclude: [],
				},
			);

		expect(act).toThrow(
			"Cannot both add and exclude the same block: --add-a, --exclude-a",
		);
	});

	it("throws an error when options add an unknown block", () => {
		const initial = [blockB, blockC];

		const act = () =>
			applyBlockRefinements(
				blocksAvailable,
				initial,
				{ "add-d": true, value: "" },
				{
					add: [],
					exclude: [],
				},
			);

		expect(act).toThrow("Unknown Block refinement option: --add-d");
	});

	it("throws an error when options exclude an unknown block", () => {
		const initial = [blockB, blockC];

		const act = () =>
			applyBlockRefinements(
				blocksAvailable,
				initial,
				{ "exclude-d": true, value: "" },
				{
					add: [],
					exclude: [],
				},
			);

		expect(act).toThrow("Unknown Block refinement option: --exclude-d");
	});

	it("returns non-excluded blocks when only exclusion refinements are provided", () => {
		const initial = [blockA, blockB];

		const actual = applyBlockRefinements(
			blocksAvailable,
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
		const blocksInitial = [blockA, blockB, blockC];

		const actual = applyBlockRefinements(
			blocksAvailable,
			blocksInitial,
			{ "exclude-a": true, value: "" },
			{
				add: [],
				exclude: [blockB],
			},
		);

		expect(actual).toEqual([blockC]);
	});
});
