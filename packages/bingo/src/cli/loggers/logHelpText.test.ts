import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../../creators/createTemplate.js";
import { logHelpText } from "./logHelpText.js";

const mockLog = {
	info: vi.fn(),
	message: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	get log() {
		return mockLog;
	},
}));

describe("logHelpText", () => {
	test("anonymous template with no options", () => {
		logHelpText(
			"setup",
			"./template.js",
			createTemplate({
				produce: vi.fn(),
			}),
		);

		expect(mockLog.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running --help for --mode setup.",
			  ],
			]
		`);
		expect(mockLog.message.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Bingo template options:

			  --directory (string): What local directory path to run under
			      npx ./template.js --directory my-fancy-project

			  --help (string): Prints help text.
			      npx ./template.js --help

			  --mode ("setup" | "transition"): Which mode to run in.
			      npx ./template.js --mode setup
			      npx ./template.js --mode transition

			  --offline (boolean): Whether to run in an "offline" mode that skips network requests.
			      npx ./template.js --offline

			  --version (boolean): Prints package versions.
			      npx ./template.js --version
			",
			  ],
			  [
			    "./template.js options:
			",
			  ],
			]
		`);
	});

	test("named template with options", () => {
		logHelpText(
			"setup",
			"./template.js",
			createTemplate({
				about: { name: "My Template" },
				options: {
					first: z.number().describe("My first option"),
					second: z.number().describe("My second option"),
				},
				produce: vi.fn(),
			}),
		);

		expect(mockLog.info.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running --help for --mode setup.",
			  ],
			]
		`);
		expect(mockLog.message.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Bingo template options:

			  --directory (string): What local directory path to run under
			      npx ./template.js --directory my-fancy-project

			  --help (string): Prints help text.
			      npx ./template.js --help

			  --mode ("setup" | "transition"): Which mode to run in.
			      npx ./template.js --mode setup
			      npx ./template.js --mode transition

			  --offline (boolean): Whether to run in an "offline" mode that skips network requests.
			      npx ./template.js --offline

			  --version (boolean): Prints package versions.
			      npx ./template.js --version
			",
			  ],
			  [
			    "My Template options:

			  --first (number): My first option.
			  --second (number): My second option.",
			  ],
			]
		`);
	});
});
