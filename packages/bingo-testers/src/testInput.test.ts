import { createInput } from "bingo";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testInput } from "./testInput.js";

const inputDoubler = createInput({
	args: [z.number()],
	produce({ args }) {
		return args[0] * 2;
	},
});

describe("testInput", () => {
	it("forwards args to the input", () => {
		const actual = testInput(inputDoubler, { args: [2] });

		expect(actual).toEqual(4);
	});
});
