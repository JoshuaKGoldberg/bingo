import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				"**/.*",
				"**/*.d.ts",
				"**/*.js",
				"**/*.astro",
				"**/vitest.*.ts",
				"packages/*/src/index.ts",
				"packages/bingo-fs/src/create*FileSystem.ts",
				"packages/site/astro.config.ts",
				"packages/site/src/content",
			],
		},
	},
});
