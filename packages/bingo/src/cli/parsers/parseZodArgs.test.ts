import { describe, expect, test } from "vitest";
import { z } from "zod";

import { parseZodArgs } from "./parseZodArgs.js";

describe("parseZodArgs", () => {
	test("boolean parsing success", () => {
		const args = ["--value"];
		const options = { value: z.boolean() };

		const actual = parseZodArgs(args, options);

		expect(actual).toEqual({ value: true });
	});

	test("union of booleans literal parsing success", () => {
		const args = ["--value"];
		const options = { value: z.union([z.literal(false), z.literal(true)]) };

		const actual = parseZodArgs(args, options);

		expect(actual).toEqual({ value: true });
	});

	test("optional string parsing success", () => {
		const args = ["--value", "abc"];
		const options = { value: z.string().optional() };

		const actual = parseZodArgs(args, options);

		expect(actual).toEqual({ value: "abc" });
	});

	test("string parsing success", () => {
		const args = ["--value", "abc"];
		const options = { value: z.string() };

		const actual = parseZodArgs(args, options);

		expect(actual).toEqual({ value: "abc" });
	});

	test("string literal parsing success", () => {
		const args = ["--value", "abc"];
		const options = { value: z.literal("abc") };

		const actual = parseZodArgs(args, options);

		expect(actual).toEqual({ value: "abc" });
	});

	test("other literal parsing failure", () => {
		const args = ["--value", "abc"];
		const options = { value: z.literal(Symbol.for("abc")) };

		const act = () => parseZodArgs(args, options);

		expect(act).toThrowError(
			`create does not know how to parse this Zod literal on the CLI: Symbol(abc)`,
		);
	});

	test("object parsing failure", () => {
		const args = ["--value"];
		const options = { value: z.object({}) };

		expect(parseZodArgs(args, options)).toEqual({ value: true });
	});
});
