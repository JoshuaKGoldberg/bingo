import { describe, expect, test } from "vitest";
import { z } from "zod";

import { isZodDefaultDef } from "./isZodDefaultDef.js";

enum Value {
	A,
	B,
	C,
}

describe("isZodDefaultDef", () => {
	test.each([
		["boolean", z.boolean(), false],
		["default boolean", z.boolean().default(false), true],
		["boolean literal", z.literal(false), false],
		["default boolean literal", z.literal(false).default(false), true],
		["number", z.number(), false],
		["default number", z.number().default(0), true],
		["number literal", z.literal(0), false],
		["default number literal", z.literal(0).default(0), true],
		["string", z.string(), false],
		["default string", z.string().default(""), true],
		["string literal", z.literal(""), false],
		["default string literal", z.literal("").default(""), true],
		["enum", z.enum(["a", "b", "c"]), false],
		["default enum", z.enum(["a", "b", "c"]).default("a"), true],
		["object", z.object({}), false],
		["default object", z.object({}).default({}), true],
		["array", z.array(z.string()), false],
		["default array", z.array(z.string()).default([]), true],
		["tuple", z.tuple([z.string()]), false],
		["default tuple", z.tuple([z.string()]).default([""]), true],
		["date", z.date(), false],
		["default date", z.date().default(new Date()), true],
		["native enum", z.nativeEnum(Value), false],
		["default native enum", z.nativeEnum(Value).default(Value.A), true],
	])("%s", (_, schema, expected) => {
		expect(isZodDefaultDef(schema._def)).toBe(expected);
	});
});
