import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createTemplate } from "../creators/createTemplate.js";
import { produceTemplate } from "./produceTemplate.js";

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
	setup({ options }) {
		return {
			files: {
				"README-setup.md": `# ${options.title}`,
			},
		};
	},
	transition({ options }) {
		return {
			files: {
				"README-transition.md": `# ${options.title}`,
			},
		};
	},
});

describe("produceTemplate", () => {
	it("runs the template's produce without augmentations when mode is undefined", async () => {
		const creation = await produceTemplate(template, {
			options: { title: "Test Title" },
		});

		expect(creation).toEqual({
			files: {
				"README.md": `# Test Title`,
			},
		});
	});

	it("runs the template's produce and setup when mode is setup", async () => {
		const creation = await produceTemplate(template, {
			mode: "setup",
			options: { title: "Test Title" },
		});

		expect(creation).toEqual({
			files: {
				"README-setup.md": `# Test Title`,
				"README.md": `# Test Title`,
			},
		});
	});

	it("runs the template's produce and transition when mode is transition", async () => {
		const creation = await produceTemplate(template, {
			mode: "transition",
			options: { title: "Test Title" },
		});

		expect(creation).toEqual({
			files: {
				"README-transition.md": `# Test Title`,
				"README.md": `# Test Title`,
			},
		});
	});
});
