import { Octokit } from "octokit";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { runBlock } from "./runBlock.js";

const base = createBase({
	options: {
		title: z.string(),
	},
});

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

describe("runBlock", () => {
	test("Block without Addons", async () => {
		const block = base.createBlock({
			produce({ options }) {
				return {
					files: {
						"README.md": `# ${options.title}`,
					},
				};
			},
		});

		const system = createSystem();

		await runBlock(block, {
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
			      "# abc",
			    ],
			  ],
			}
		`);
	});

	describe("Block with Addons", () => {
		const block = base.createBlock({
			addons: {
				descriptions: z.array(z.string()).default([]),
			},
			produce({ addons, options }) {
				return {
					files: {
						"README.md": `# ${options.title}\n${addons.descriptions.join("\n")}`,
					},
				};
			},
		});

		test("default Addon value", async () => {
			const system = createSystem();

			await runBlock(block, {
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

		test("provided Addon value", async () => {
			const system = createSystem();

			await runBlock(block, {
				addons: {
					descriptions: ["def"],
				},
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
				def",
				    ],
				  ],
				}
			`);
		});
	});
});
