import { describe, expect, test, vi } from "vitest";

import { BlockWithAddons } from "../types/blocks.js";
import { mergeAddons } from "./mergeAddons.js";

const blockFirst: BlockWithAddons<object, object> = Object.assign(vi.fn(), {
	about: { name: "Block First" },
	produce: vi.fn(),
});

const blockSecond: BlockWithAddons<object, object> = Object.assign(vi.fn(), {
	about: { name: "BlockSecond" },
	produce: vi.fn(),
});

const sharedObject = { value: true };

describe("mergeAddons", () => {
	test.each([
		[
			[{ addons: [null], block: blockFirst }],
			[{ addons: [undefined], block: blockFirst }],
			[{ addons: [], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: [123], block: blockFirst }],
			[{ addons: ["a", 123], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["b"], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b"], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b", "c"], block: blockFirst }],
			[{ addons: ["a", "b", "c"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b", "c", "d"], block: blockFirst }],
			[{ addons: ["a", "b", "c", "d"], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: [null], block: blockFirst }],
			[{ addons: ["a"], block: blockFirst }],
		],
		[
			[{ addons: ["a", undefined, null, "b"], block: blockFirst }],
			[{ addons: [null], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["a"], block: blockSecond }],
			[
				{ addons: ["a"], block: blockFirst },
				{ addons: ["a"], block: blockSecond },
			],
		],
		[
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
		],
		[
			[{ addons: [{ values: ["a", { b: "c" }] }], block: blockFirst }],
			[{ addons: [{ values: ["a", { b: "c" }] }], block: blockFirst }],
			[{ addons: [{ values: ["a", { b: "c" }] }], block: blockFirst }],
		],
		[
			[{ addons: [{ value: {} }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[
				{
					addons: [{ value: {} }, { value: { inner: true } }],
					block: blockFirst,
				},
			],
		],
		[
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[{ addons: [{ value: {} }], block: blockFirst }],
			[
				{
					addons: [{ value: { inner: true } }, { value: {} }],
					block: blockFirst,
				},
			],
		],
		[
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[{ addons: [{ value: [true] }], block: blockFirst }],
			[
				{
					addons: [{ value: { inner: true } }, { value: [true] }],
					block: blockFirst,
				},
			],
		],
		[
			[{ addons: [{ value: { inner: false } }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[
				{
					addons: [{ value: { inner: false } }, { value: { inner: true } }],
					block: blockFirst,
				},
			],
		],
		[
			[{ addons: [sharedObject], block: blockFirst }],
			[{ addons: [sharedObject], block: blockFirst }],
			[{ addons: [sharedObject], block: blockFirst }],
		],
		[
			[
				{
					addons: [{ name: "First", steps: ["a", "b"] }],
					block: blockFirst,
				},
			],
			[
				{
					addons: [{ name: "Second", steps: ["c", "d"] }],
					block: blockFirst,
				},
			],
			[
				{
					addons: [
						{ name: "First", steps: ["a", "b"] },
						{ name: "Second", steps: ["c", "d"] },
					],
					block: blockFirst,
				},
			],
		],
		[
			[
				{
					addons: [
						{ name: "First", steps: ["a", "b"] },
						{ name: "Second", steps: ["c", "d"] },
					],
					block: blockFirst,
				},
			],
			[
				{
					addons: [
						{ name: "Second", steps: ["c", "d"] },
						{ name: "Third", steps: ["e", "f"] },
					],
					block: blockFirst,
				},
			],
			[
				{
					addons: [
						{ name: "First", steps: ["a", "b"] },
						{ name: "Second", steps: ["c", "d"] },
						{ name: "Third", steps: ["e", "f"] },
					],
					block: blockFirst,
				},
			],
		],
	])("%j and %j", (first, second, expected) => {
		expect(mergeAddons(first, second)).toEqual(expected);
	});
});
