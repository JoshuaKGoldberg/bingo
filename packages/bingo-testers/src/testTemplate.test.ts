import { createTemplate } from "bingo";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testTemplate } from "./testTemplate.js";

describe("testTemplate", () => {
	describe("options", () => {
		const template = createTemplate({
			options: {
				value: z.string(),
			},
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		it("passes options to the block when provided via options", async () => {
			const actual = await testTemplate(template, {
				options: { value: "abc" },
			});

			expect(actual).toEqual({
				files: { "value.txt": "abc" },
			});
		});
	});
});
