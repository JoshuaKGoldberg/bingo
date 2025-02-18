import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";

const base = createBase({
	options: { name: z.string() },
});

describe("createBase", () => {
	describe("createBlock", () => {
		describe("without Addons", () => {
			it("produces without Addons", () => {
				const block = base.createBlock({
					produce({ options }) {
						return {
							files: {
								"name.txt": options.name,
							},
						};
					},
				});

				const production = block.produce({ options: { name: "abc" } });

				expect(production).toEqual({
					files: {
						"name.txt": "abc",
					},
				});
			});
		});

		describe("with Addons", () => {
			it("applies Zod defaults when producing with Addons", () => {
				const block = base.createBlock({
					addons: {
						names: z.array(z.string()).default([]),
					},
					produce({ addons, options }) {
						const { names } = addons;

						return {
							files: {
								"names.txt": [options.name, ...names].join("\n"),
							},
						};
					},
				});

				const production = block.produce({
					addons: { names: ["def"] },
					options: { name: "abc" },
				});

				expect(production).toEqual({
					files: {
						"names.txt": "abc\ndef",
					},
				});
			});
		});
	});
});
