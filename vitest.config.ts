import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			exclude: ["**/.*/", "**/*.config.*", "**/*.d.ts"],
		},
		exclude: ["packages/*/lib"],
		include: ["packages/*/src/**/*.ts"],
		setupFiles: ["console-fail-test/setup"],
		workspace: [
			"packages/*",
			{
				test: {
					clearMocks: true,
					exclude: ["packages/*/lib"],
					include: ["packages/*/src"],
					setupFiles: ["console-fail-test/setup"],
				},
			},
		],
	},
});
