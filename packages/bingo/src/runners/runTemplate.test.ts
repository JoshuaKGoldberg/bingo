import { Octokit } from "octokit";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "../creators/createTemplate.js";
import { runTemplate } from "./runTemplate.js";

function createSystem() {
	return {
		fetchers: {
			fetch: noop("fetch"),
			octokit: {} as Octokit,
		},
		fs: {
			readDirectory: noop("readDirectory"),
			readFile: noop("readFile"),
			writeDirectory: vi.fn(),
			writeFile: vi.fn(),
		},
		runner: noop("runner"),
	};
}

function noop(label: string) {
	return vi.fn().mockReturnValue(`Not implemented: ${label}`);
}

describe("runTemplate", () => {
	test("production", async () => {
		const template = createTemplate({
			about: { name: "Test Template" },
			options: {
				title: z.string(),
			},
			produce({ options }) {
				return {
					files: {
						"README.md": `# ${options.title}`,
					},
				};
			},
		});

		const system = createSystem();

		await runTemplate(template, {
			options: { title: "abc" },
			...system,
		});

		expect({
			writeDirectory: system.fs.writeDirectory.mock.calls,
			writeFile: system.fs.writeFile.mock.calls,
		}).toMatchInlineSnapshot(`
			{
			  "writeDirectory": [
			    [
			      ".",
			    ],
			  ],
			  "writeFile": [
			    [
			      "README.md",
			      "# abc
			",
			    ],
			  ],
			}
		`);
	});
});
