import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createTemplate } from "./createTemplate.js";

describe("createTemplate", () => {
	it("adds options.owner when the definition options don't include owner", () => {
		const template = createTemplate({
			produce: vi.fn(),
		});

		expect(template.options.owner).toBeInstanceOf(z.ZodOptional);
	});

	it("uses definition.options.owner when it exists", () => {
		const owner = z.string();
		const template = createTemplate({
			options: { owner },
			produce: vi.fn(),
		});

		expect(template.options.owner).toBe(owner);
	});
});
