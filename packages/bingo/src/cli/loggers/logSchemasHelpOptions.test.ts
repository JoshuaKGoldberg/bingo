import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

const mockLogHelpOptions = vi.fn();

vi.mock("./logHelpOptions.js", () => ({
	get logHelpOptions() {
		return mockLogHelpOptions;
	},
}));

describe("logSchemasHelpOptions", () => {
	test("schemas", () => {
		logSchemasHelpOptions("bingo-my-app", {
			many: z.array(z.number()).describe("many values"),
			numeric: z.number().describe("a numeric value"),
			stringy: z.number().describe("a string value").optional(),
			transformed: z
				.union([
					z.string(),
					z.object({
						first: z.string(),
						second: z.string(),
					}),
				])
				.transform(vi.fn())
				.describe(
					"email address to be listed as the point of contact in docs and packages",
				),
			union: z.union([z.literal("abc"), z.literal(123)]),
		});

		expect(mockLogHelpOptions.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "bingo-my-app",
			    [
			      {
			        "flag": "many",
			        "text": "Many values.",
			        "type": "number[]",
			      },
			      {
			        "flag": "numeric",
			        "text": "A numeric value.",
			        "type": "number",
			      },
			      {
			        "flag": "stringy",
			        "text": "A string value.",
			        "type": "number",
			      },
			      {
			        "flag": "transformed",
			        "text": "Email address to be listed as the point of contact in docs and packages.",
			        "type": "string",
			      },
			      {
			        "flag": "union",
			        "text": undefined,
			        "type": ""abc" | 123",
			      },
			    ],
			  ],
			]
		`);
	});
});
