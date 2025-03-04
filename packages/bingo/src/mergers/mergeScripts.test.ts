import { describe, expect, test } from "vitest";

import { mergeScripts } from "./mergeScripts.js";

describe("mergeScripts", () => {
	test.each([
		[[], [], []],
		[[], ["a"], ["a"]],
		[["a"], [], ["a"]],
		[["a"], ["a"], ["a"]],
		[["a"], ["b"], ["a", "b"]],
		[
			[
				{
					commands: ["pnpm build"],
				},
			],
			[
				{
					commands: ["pnpm build"],
				},
			],
			[
				{
					commands: ["pnpm build"],
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					silent: true,
				},
			],
			[
				{
					commands: ["pnpm build"],
				},
			],
			[
				{
					commands: ["pnpm build"],
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					silent: true,
				},
			],
			[
				{
					commands: ["pnpm build"],
					silent: true,
				},
			],
			[
				{
					commands: ["pnpm build"],
					silent: true,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				{
					commands: ["pnpm build"],
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			["pnpm build"],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				"pnpm build",
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			["pnpm other"],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				"pnpm other",
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			["pnpm other:a", "pnpm other:b"],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				"pnpm other:a",
				"pnpm other:b",
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
				{
					commands: ["pnpm build", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:c"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build", "pnpm run:a", "pnpm run:b"],
					phase: 0,
				},
				{
					commands: ["pnpm build", "pnpm run:c"],
					phase: 0,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 1,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				{
					commands: ["pnpm build"],
					phase: 1,
				},
			],
		],
		[
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
			],
			[
				{
					commands: ["pnpm lint"],
					phase: 1,
				},
			],
			[
				{
					commands: ["pnpm build"],
					phase: 0,
				},
				{
					commands: ["pnpm lint"],
					phase: 1,
				},
			],
		],
		[
			[
				{ commands: ["rm CODE_OF_CONDUCT.md"], phase: 0 },
				{ commands: ["rm DEVELOPMENT.md"], phase: 0 },
			],
			[{ commands: ["rm DEVELOPMENT.md"], phase: 0 }],
			[
				{ commands: ["rm CODE_OF_CONDUCT.md"], phase: 0 },
				{ commands: ["rm DEVELOPMENT.md"], phase: 0 },
			],
		],
		[
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0 },
				{ commands: ["rm CODE_OF_CONDUCT.md"], phase: 0 },
				{ commands: ["rm DEVELOPMENT.md"], phase: 0 },
			],
			[{ commands: ["rm DEVELOPMENT.md"], phase: 0 }],
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0 },
				{ commands: ["rm CODE_OF_CONDUCT.md"], phase: 0 },
				{ commands: ["rm DEVELOPMENT.md"], phase: 0 },
			],
		],
		[
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["pnpm install"], phase: 1 },
			],
			[{ commands: ["rm .prettierrc*"], phase: 0 }],
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["rm .prettierrc*"], phase: 0 },
				{ commands: ["pnpm install"], phase: 1 },
			],
		],
		[
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["rm .eslintrc*"], phase: 0, silent: true },
			],
			[{ commands: ["rm .prettierrc* prettier.config*"], phase: 0 }],
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["rm .eslintrc*"], phase: 0, silent: true },
				{ commands: ["rm .prettierrc* prettier.config*"], phase: 0 },
			],
		],
		[
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["rm .eslintrc*"], phase: 0, silent: true },
				{ commands: ["pnpm install", "pnpm dedupe --offline"], phase: 1 },
			],
			[
				{ commands: ["pnpm format --write"], phase: 2 },
				{ commands: ["rm .prettierrc* prettier.config*"], phase: 0 },
			],
			[
				{ commands: ["rm CONTRIBUTING.md"], phase: 0, silent: true },
				{ commands: ["rm .eslintrc*"], phase: 0, silent: true },
				{ commands: ["rm .prettierrc* prettier.config*"], phase: 0 },
				{ commands: ["pnpm install", "pnpm dedupe --offline"], phase: 1 },
				{ commands: ["pnpm format --write"], phase: 2 },
			],
		],
	])("%j and %j", (first, second, expected) => {
		const actual = mergeScripts(first, second);

		expect(actual).toEqual(expected);
	});
});
