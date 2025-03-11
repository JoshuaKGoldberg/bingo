import { describe, expect, test } from "vitest";
import { z } from "zod";

import { isStringLikeSchema } from "./isStringLikeSchema.js";

enum Value {
	A,
	B,
	C,
}

describe("isStringLikeSchema", () => {
	test.each([
		["boolean", z.boolean(), true],
		["boolean literal", z.literal(false), true],
		["number", z.number(), true],
		["number literal", z.literal(0), true],
		["string", z.string(), true],
		["string literal", z.literal(""), true],
		[
			"union of string-likes",
			z.union([z.boolean(), z.number(), z.string()]),
			true,
		],
		[
			"union of primitives",
			z.union([z.literal(false), z.literal(0), z.literal("")]),
			true,
		],
		["default boolean", z.boolean().default(false), true],
		["default boolean literal", z.literal(false).default(false), true],
		["default number", z.number().default(0), true],
		["default number literal", z.literal(0).default(0), true],
		["default string", z.string().default(""), true],
		["default string literal", z.literal("").default(""), true],
		[
			"default union of string-likes",
			z.union([z.boolean(), z.number(), z.string()]).default(""),
			true,
		],
		["optional boolean", z.boolean().optional(), true],
		["optional boolean literal", z.literal(false).optional(), true],
		["optional number", z.number().optional(), true],
		["optional number literal", z.literal(0).optional(), true],
		["optional string", z.string().optional(), true],
		["optional string literal", z.literal("").optional(), true],
		[
			"optional union of string-likes",
			z.union([z.boolean(), z.number(), z.string()]).optional(),
			true,
		],
		["default optional boolean", z.boolean().default(false).optional(), true],
		["default optional number", z.number().default(0).optional(), true],
		["default optional string", z.string().default("").optional(), true],
		[
			"default optional union of string-likes",
			z.union([z.boolean(), z.number(), z.string()]).default("").optional(),
			true,
		],
		["optional default boolean", z.boolean().optional().default(false), true],
		["optional default number", z.number().optional().default(0), true],
		["optional default string", z.string().optional().default(""), true],
		[
			"optional default union of string-likes",
			z
				.union([z.boolean(), z.number(), z.string()])
				.default("")
				.optional()
				.default(""),
			true,
		],
		["enum", z.enum(["a", "b", "c"]), true],
		["object", z.object({}), false],
		["default object", z.object({}).default({}), false],
		["optional object", z.object({}).optional(), false],
		["default optional object", z.object({}).default({}).optional(), false],
		["optional default object", z.object({}).optional().default({}), false],
		["intersection", z.intersection(z.object({}), z.object({})), false],
		["array", z.array(z.string()), false],
		["tuple", z.tuple([z.string()]), false],
		["date", z.date(), false],
		["native enum", z.nativeEnum(Value), false],
	])("%s", (_, schema, expected) => {
		expect(isStringLikeSchema(schema)).toBe(expected);
	});
});
