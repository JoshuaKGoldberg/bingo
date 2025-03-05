import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { templateMismatchError } from "./templateMismatchError.js";

const templateAnonymousA = createTemplate({
	produce: vi.fn(),
});

const templateAnonymousB = createTemplate({
	produce: vi.fn(),
});

const templateNamedA = createTemplate({
	about: { name: "A" },
	produce: vi.fn(),
});

const templateNamedB = createTemplate({
	about: { name: "B" },
	produce: vi.fn(),
});

describe("templateMismatchError", () => {
	it("returns a fully named error when both templates have names", () => {
		const actual = templateMismatchError(templateNamedA, templateNamedB);

		expect(actual).toEqual(
			new Error(
				`Config file template A is not the same as running template B.`,
			),
		);
	});

	it("returns a fully anonymous error when both templates are anonymous", () => {
		const actual = templateMismatchError(
			templateAnonymousA,
			templateAnonymousB,
		);

		expect(actual).toEqual(
			new Error(
				`Config file and running template are mismatched and do not have identifying names.`,
			),
		);
	});

	it("returns a mixed error when the config template is anonymous and the running template is named", () => {
		const actual = templateMismatchError(templateAnonymousA, templateNamedB);

		expect(actual).toEqual(
			new Error(
				`Config file template (anonymous) is not the same as running template B.`,
			),
		);
	});

	it("returns a mixed error when the config template is named and the running template is anonymous", () => {
		const actual = templateMismatchError(templateNamedA, templateAnonymousB);

		expect(actual).toEqual(
			new Error(
				`Config file template A is not the same as running template (anonymous).`,
			),
		);
	});
});
