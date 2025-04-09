import { IntakeFileEntry } from "bingo-fs";
import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceBlocks } from "./produceBlocks.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

describe("produceBlocks", () => {
	test("files from one block", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
		});

		const result = produceBlocks([block], {
			options: { value: "Hello, world!" },
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!",
			},
		});
	});

	it("adds addons when provided only under blockAddons", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			addons: {
				extra: z.string().optional(),
			},
			produce({ addons, options }) {
				return {
					files: { "README.md": [options.value, addons.extra].join("\n") },
				};
			},
		});

		const result = produceBlocks([block], {
			blockAddons: [block({ extra: "line" })],
			options: { value: "Hello, world!" },
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!\nline",
			},
		});
	});

	it("adds addons when provided only via Block intake", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			addons: {
				extra: z.string().optional(),
			},
			intake({ files }) {
				return {
					extra: (files["README.md"] as IntakeFileEntry)[0].split("\n").at(-1),
				};
			},
			produce({ addons, options }) {
				return {
					files: { "README.md": [options.value, addons.extra].join("\n") },
				};
			},
		});

		const result = produceBlocks([block], {
			files: {
				"README.md": ["Before\nline"],
			},
			options: { value: "Hello, world!" },
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!\nline",
			},
		});
	});

	it("adds merges addons when provided by Block intake and blockAddons", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			addons: {
				a: z.string().optional(),
				b: z.string().optional(),
				c: z.string().optional(),
			},
			intake() {
				return {
					a: "intake",
					b: "intake",
				};
			},
			produce({ addons, options }) {
				return {
					files: {
						"README.md": [options.value, addons.a, addons.b, addons.c].join(
							"\n",
						),
					},
				};
			},
		});

		const result = produceBlocks([block], {
			blockAddons: [
				block({
					b: "provided",
					c: "provided",
				}),
			],
			options: { value: "Hello, world!" },
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!\nintake\nprovided\nprovided",
			},
		});
	});

	it("doesn't include addons to blocks that aren't defined", () => {
		const blockKnown = base.createBlock({
			about: {
				name: "Known Block",
			},
			produce({ options }) {
				return {
					addons: [blockUnknown({ extra: "line" })],
					files: { "README.md": options.value },
				};
			},
		});

		const blockUnknown = base.createBlock({
			about: {
				name: "Unknown Block",
			},
			addons: {
				extra: z.string().optional(),
			},
			produce: vi.fn(),
		});

		const result = produceBlocks([blockKnown], {
			options: { value: "Hello, world!" },
		});

		expect(result).toEqual({
			addons: [blockUnknown({ extra: "line" })],
			files: {
				"README.md": "Hello, world!",
			},
		});
	});

	describe("modes", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
			setup({ options }) {
				return {
					files: {
						"data.txt": options.value,
					},
				};
			},
			transition() {
				return {
					scripts: ["rm old.txt"],
				};
			},
		});

		it("does not augment creations with a Block's setup() or transition() when mode is undefined", () => {
			const result = produceBlocks([block], {
				options: { value: "Hello, world!" },
			});

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's setup() when mode is 'setup'", () => {
			const result = produceBlocks([block], {
				mode: "setup",
				options: { value: "Hello, world!" },
			});

			expect(result).toEqual({
				files: {
					"data.txt": "Hello, world!",
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's transition() when mode is 'transition'", () => {
			const result = produceBlocks([block], {
				mode: "transition",
				options: { value: "Hello, world!" },
			});

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
				scripts: ["rm old.txt"],
			});
		});
	});
});
