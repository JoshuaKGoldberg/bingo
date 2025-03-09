import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBlock } from "./createBlock.js";

describe("createBlock", () => {
	describe("without Addons", () => {
		it("produces without Addons", () => {
			const block = createBlock<{ name: string }>({
				produce({ options }) {
					return {
						files: {
							"name.txt": `${options.name} (${options.preset})`,
						},
					};
				},
			});

			const production = block.produce({
				options: { name: "abc", preset: "test" },
			});

			expect(production).toEqual({
				files: {
					"name.txt": "abc (test)",
				},
			});
		});
	});

	describe("with Addons", () => {
		it("applies Zod defaults when producing with Addons", () => {
			const block = createBlock<
				{ names: z.ZodDefault<z.ZodArray<z.ZodString>> },
				{ name: string }
			>({
				addons: {
					names: z.array(z.string()).default([]),
				},
				produce({ addons, options }) {
					const { names } = addons;

					return {
						files: {
							"names.txt": [options.preset, options.name, ...names].join("\n"),
						},
					};
				},
			});

			const production = block.produce({
				addons: { names: ["def"] },
				options: { name: "abc", preset: "test" },
			});

			expect(production).toEqual({
				files: {
					"names.txt": "test\nabc\ndef",
				},
			});
		});
	});
});
