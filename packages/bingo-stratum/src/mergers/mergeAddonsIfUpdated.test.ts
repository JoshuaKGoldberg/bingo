import { describe, expect, it } from "vitest";

import { mergeAddonsIfUpdated } from "./mergeAddonsIfUpdated.js";

describe("mergeArgsIfUpdated", () => {
	it.each([
		[{}, {}, undefined],
		[{ a: true }, {}, { a: true }],
		[{ a: true }, { a: null }, undefined],
		[{ a: true }, { a: true }, undefined],
		[
			{ a: true },
			{ a: false },
			new Error("Mismatched merging addons (true vs. false)."),
		],
		[
			{ a: [] },
			{ a: false },
			new Error("Mismatched merging addons (Array.isArray)."),
		],
		[
			{ a: {} },
			{ a: false },
			new Error("Mismatched merging addons (typeof object)."),
		],
		[{ a: true }, { b: true }, { a: true, b: true }],
		[{}, { b: true }, { b: true }],
		[{ a: [] }, {}, { a: [] }],
		[{ a: [] }, { b: [] }, { a: [], b: [] }],
		[{}, { b: [] }, { b: [] }],
		[{ a: ["a"] }, { b: ["b"] }, { a: ["a"], b: ["b"] }],
		[{ a: ["a1"] }, { a: ["a2"] }, { a: ["a1", "a2"] }],
		[{ a: ["a1"] }, { a: ["a1"] }, undefined],
		[{ a: { a1: true } }, { a: { a1: true } }, undefined],
		[
			{ a: { a1: true } },
			{ a: { a1: false } },
			new Error("Mismatched merging addons (true vs. false)."),
		],
		[{ a: { a1: ["a2"] } }, { a: { a1: ["a2"] } }, undefined],
		[{ a: { a1: ["a2"] } }, { a: { a1: ["a3"] } }, { a: { a1: ["a2", "a3"] } }],
		[{ imports: ["a", "b"] }, { imports: ["a", "b"] }, undefined],
		[
			{ imports: [{ from: "a", source: "b" }] },
			{ imports: [{ from: "a", source: "b" }] },
			undefined,
		],
	])("when given %j and %j, produces %j", (existingArgs, newArgs, expected) => {
		const actual = mergeAddonsIfUpdated(existingArgs, newArgs);

		expect(actual).toEqual(expected);
	});
});
