import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceBlock } from "./produceBlock.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

const options = {
	value: "Hello, world!",
};

describe("produceBlock", () => {
	it("returns the creation when no Addons or mode are defined", () => {
		const block = base.createBlock({
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
		});

		const actual = produceBlock(block, { options });

		expect(actual).toEqual({
			files: {
				"README.md": "Hello, world!",
			},
		});
	});

	it("passes Addons to the Block when addons is defined", () => {
		const block = base.createBlock({
			addons: {
				extra: z.record(z.string()).optional(),
			},
			produce({ addons, options }) {
				return {
					files: {
						"README.md": options.value,
						...addons.extra,
					},
				};
			},
		});

		const actual = produceBlock(block, {
			addons: {
				extra: {
					"a.txt": "a",
				},
			},
			options,
		});

		expect(actual).toEqual({
			files: {
				"a.txt": "a",
				"README.md": "Hello, world!",
			},
		});
	});

	it("augments the creation when mode is provided and the Block has that mode-specific producer", () => {
		const block = base.createBlock({
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
			setup() {
				return {
					files: { "extra.txt": "setup" },
				};
			},
		});

		const actual = produceBlock(block, {
			mode: "setup",
			options,
		});

		expect(actual).toEqual({
			files: {
				"extra.txt": "setup",
				"README.md": "Hello, world!",
			},
		});
	});
});
