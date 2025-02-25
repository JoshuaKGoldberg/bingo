import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";

const base = createBase({
	options: { name: z.string() },
});

describe("createStratumTemplate", () => {
	it("creates no --exclude options when there are no blocks", () => {
		const template = base.createStratumTemplate({
			presets: [],
		});

		expect(Object.keys(template.options)).toEqual(["name", "preset"]);
	});

	it("creates no --exclude options when there there are only anonymous blocks", () => {
		const template = base.createStratumTemplate({
			presets: [
				base.createPreset({
					about: { name: "Preset" },
					blocks: [
						base.createBlock({
							produce: vi.fn(),
						}),
					],
				}),
			],
		});

		expect(Object.keys(template.options)).toEqual(["name", "preset"]);
	});

	it("creates --exclude options when there there are named blocks", () => {
		const template = base.createStratumTemplate({
			presets: [
				base.createPreset({
					about: { name: "Preset" },
					blocks: [
						base.createBlock({
							produce: vi.fn(),
						}),
						base.createBlock({
							about: { name: "A" },
							produce: vi.fn(),
						}),
						base.createBlock({
							about: { name: "A BC Def" },
							produce: vi.fn(),
						}),
						base.createBlock({
							produce: vi.fn(),
						}),
					],
				}),
			],
		});

		expect(Object.keys(template.options)).toEqual([
			"name",
			"excludeA",
			"excludeABCDef",
			"preset",
		]);
	});
});
