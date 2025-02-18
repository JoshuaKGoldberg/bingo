import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../creators/createTemplate.js";
import { HasOptionsAndPrepare, prepareOptions } from "./prepareOptions.js";

const system = {
	fetchers: {
		fetch: vi.fn(),
		octokit: {} as Octokit,
	},
	fs: {
		readDirectory: vi.fn(),
		readFile: vi.fn(),
		writeDirectory: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
};

describe("prepareOptions", () => {
	it("returns {} when no settings.options exists and the base does not have a prepare()", async () => {
		const baseWithNoPrepare = {
			options: {
				value: z.string().optional(),
			},
		};

		const actual = await prepareOptions(baseWithNoPrepare, { ...system });

		expect(actual).toEqual({});
	});

	it("returns settings.options directly when it exists and the base does not have a prepare()", async () => {
		const baseWithNoPrepare = {
			options: {
				value: z.string().optional(),
			},
		};

		const options = { value: "input" };
		const actual = await prepareOptions(baseWithNoPrepare, {
			...system,
			existing: options,
		});

		expect(actual).toEqual(options);
	});

	describe("prepare", () => {
		const baseWithOptionalOption: HasOptionsAndPrepare<{
			value: z.ZodOptional<z.ZodString>;
		}> = {
			options: {
				value: z.string().optional(),
			},
			prepare({ options }) {
				return {
					value: options.value ?? "default",
				};
			},
		};

		it("uses an option value from produce when settings do not have options", async () => {
			const actual = await prepareOptions(baseWithOptionalOption, system);

			expect(actual).toEqual({ value: "default" });
		});

		it("uses an option value from produce when settings do not have the options value", async () => {
			const actual = await prepareOptions(baseWithOptionalOption, {
				...system,
				existing: {},
			});

			expect(actual).toEqual({ value: "default" });
		});

		it("uses an option value from settings when settings have the options value", async () => {
			const actual = await prepareOptions(baseWithOptionalOption, {
				...system,
				existing: {
					value: "override",
				},
			});

			expect(actual).toEqual({ value: "override" });
		});

		it("prepares options when given a template", async () => {
			const template = createTemplate({
				options: {
					value: z.string(),
				},
				prepare() {
					return {
						value: () => Promise.resolve("default"),
					};
				},
				produce() {
					return {};
				},
			});

			const actual = await prepareOptions(template);

			expect(actual).toEqual({ value: "default" });
		});
	});
});
