import { describe, expect, it } from "vitest";

import { mergeCreations } from "./mergeCreations.js";

const emptyCreation = {
	files: {},
	requests: [],
	scripts: [],
};

describe("mergeCreations", () => {
	it("returns a merged creation when given two overlapping ones", () => {
		const actual = mergeCreations(
			{
				...emptyCreation,
				files: {
					"README.md": "Hello, world!",
					src: {
						"index.ts": "",
					},
				},
				scripts: [{ commands: ["run a", "run b"], phase: 0 }],
			},
			{
				files: {
					src: {
						"second.ts": "// ...",
					},
				},
				scripts: [{ commands: ["run c", "run d"], phase: 0 }],
			},
		);

		expect(actual).toMatchInlineSnapshot(`
			{
			  "files": {
			    "README.md": "Hello, world!",
			    "src": {
			      "index.ts": "",
			      "second.ts": "// ...",
			    },
			  },
			  "requests": [],
			  "scripts": [
			    {
			      "commands": [
			        "run a",
			        "run b",
			      ],
			      "phase": 0,
			    },
			    {
			      "commands": [
			        "run c",
			        "run d",
			      ],
			      "phase": 0,
			    },
			  ],
			}
		`);
	});

	it("reports a detailed files complaint when files conflict", () => {
		expect(() =>
			mergeCreations(
				{
					...emptyCreation,
					files: {
						src: {
							"index.ts": "a",
						},
					},
				},
				{
					...emptyCreation,
					files: {
						src: {
							"index.ts": "b",
						},
					},
				},
			),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Conflicting created files at path: 'src/index.ts'.]`,
		);
	});
});
