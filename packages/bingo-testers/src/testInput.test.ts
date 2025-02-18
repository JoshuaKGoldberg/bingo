import { createInput } from "bingo";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testInput } from "./testInput.js";

const inputDoubler = createInput({
	args: {
		value: z.number(),
	},
	produce({ args }) {
		return args.value * 2;
	},
});

describe("testInput", () => {
	it("forwards args to the input", () => {
		const actual = testInput(inputDoubler, { args: { value: 2 } });

		expect(actual).toEqual(4);
	});
});
