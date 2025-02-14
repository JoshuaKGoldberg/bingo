// https://github.com/typescript-eslint/typescript-eslint/issues/10508
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import jsonc from "eslint-plugin-jsonc";
import markdown from "eslint-plugin-markdown";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import perfectionist from "eslint-plugin-perfectionist";
import * as regexp from "eslint-plugin-regexp";
import yml from "eslint-plugin-yml";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/*.snap",
			"coverage",
			"lib",
			"node_modules",
			"packages/*/dist",
			"packages/*/lib",
			"packages/*/tsconfig.tsbuildinfo",
			"packages/*/src/**/*.d.ts",
			"packages/*/src/**/*.js",
			"packages/site/.astro",
			"packages/site/src/content",
			"packages/site/src/env.d.ts",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
		],
	},
	{ linterOptions: { reportUnusedDisableDirectives: "error" } },
	js.configs.recommended,
	// https://github.com/eslint-community/eslint-plugin-eslint-comments/issues/214
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	comments.recommended,
	jsdoc.configs["flat/contents-typescript-error"],
	jsdoc.configs["flat/logical-typescript-error"],
	jsdoc.configs["flat/stylistic-typescript-error"],
	...jsonc.configs["flat/recommended-with-json"],
	...markdown.configs.recommended,
	perfectionist.configs["recommended-natural"],
	regexp.configs["flat/recommended"],
	{
		extends: [packageJson],
		files: ["**/package.json"],
	},
	{
		extends: [...tseslint.configs.strict, ...tseslint.configs.stylistic],
		files: ["**/*.js", "**/*.ts"],
		rules: {
			// These off-by-default rules work well for this repo and we like them on.
			"jsdoc/informative-docs": "error",

			// https://github.com/gajus/eslint-plugin-jsdoc/issues/1343
			"jsdoc/lines-before-block": "off",

			// Stylistic concerns that don't interfere with Prettier
			"logical-assignment-operators": [
				"error",
				"always",
				{ enforceForIfStatements: true },
			],
			"no-useless-rename": "error",
			"object-shorthand": "error",
			"operator-assignment": "error",
		},
		settings: { perfectionist: { partitionByComment: true, type: "natural" } },
	},
	{
		extends: [
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
		files: ["**/*.js", "**/*.ts"],
		ignores: ["**/*.md/*", "packages/*/bin/*.js", "packages/*/*.config.*"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// These on-by-default rules work well for this repo if configured
			"@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "all" }],
		},
	},
	{
		files: ["*.jsonc"],
		rules: {
			"jsonc/comma-dangle": "off",
			"jsonc/no-comments": "off",
			"jsonc/sort-keys": "error",
		},
	},
	{
		extends: [vitest.configs.recommended],
		files: ["**/*.test.*"],
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "off",
		},
	},
	{
		extends: [
			...yml.configs["flat/recommended"],
			...yml.configs["flat/prettier"],
		],
		files: ["**/*.{yml,yaml}"],
		rules: {
			"yml/file-extension": ["error", { extension: "yml" }],
			"yml/sort-keys": [
				"error",
				{
					order: { type: "asc" },
					pathPattern: "^.*$",
				},
			],
			"yml/sort-sequence-values": [
				"error",
				{
					order: { type: "asc" },
					pathPattern: "^.*$",
				},
			],
		},
	},
);
