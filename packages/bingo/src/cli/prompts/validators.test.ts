import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import {
	validateNewDirectory,
	validateNumber,
	validatorFromSchema,
} from "./validators.js";

const mockExistsSync = vi.fn();

vi.mock("node:fs", () => ({
	get existsSync() {
		return mockExistsSync;
	},
}));

describe("validateNewDirectory", () => {
	it("returns undefined when the directory does not exist", () => {
		mockExistsSync.mockReturnValueOnce(true);

		const actual = validateNewDirectory("dir");

		expect(actual).toBe(
			"That directory already exists. Please choose another one.",
		);
	});

	it("returns a complaint when the directory exists", () => {
		mockExistsSync.mockReturnValueOnce(true);

		const actual = validateNewDirectory("dir");

		expect(actual).toBe(
			"That directory already exists. Please choose another one.",
		);
	});

	it("returns a complaint when the directory name is empty", () => {
		const actual = validateNewDirectory("");

		expect(actual).toBe("Please enter a value.");
		expect(mockExistsSync).not.toHaveBeenCalled();
	});
});

describe("validateNumber", () => {
	test.each([
		["", "Please enter a numeric value."],
		["a", "Please enter a numeric value."],
		["a1", "Please enter a numeric value."],
		["0", undefined],
		["1", undefined],
	])("%j", (input, expected) => {
		expect(validateNumber(input)).toEqual(expected);
	});
});

describe("validatorFromSchema", () => {
	const schema = z.string().refine((value) => value !== "a", {
		message: "Value cannot be 'a'",
	});

	const validator = validatorFromSchema(schema);

	test.each([
		["a", "Value cannot be 'a'"],
		["", "Please enter a value."],
		["b", undefined],
	])("%j", (input, expected) => {
		expect(validator(input)).toEqual(expected);
	});
});
