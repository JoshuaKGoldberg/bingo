import { testInput } from "bingo-testers";
import { describe, expect, it } from "vitest";

import { inputFromFileJSON } from "./index.js";

describe("inputFromFileJSON", () => {
	it("returns the file's data when inputFromFile resolves with a data string", async () => {
		const data = { value: "abc123" };

		const actual = await testInput(inputFromFileJSON, {
			args: ["file.txt"],
			take: () => Promise.resolve(JSON.stringify(data)),
		});

		expect(actual).toEqual(data);
	});

	it("returns the error when inputFromFile resolves with an error", async () => {
		const error = new Error("Oh no!");

		const actual = await testInput(inputFromFileJSON, {
			args: ["file.txt"],
			take: () => error,
		});

		expect(actual).toEqual(error);
	});

	it("returns the parsing error when inputFromFile resolves with non-parsable string", async () => {
		const actual = await testInput(inputFromFileJSON, {
			args: ["file.txt"],
			take: () => Promise.resolve("invalid"),
		});

		expect(actual).toEqual(
			new SyntaxError(`Unexpected token 'i', "invalid" is not valid JSON`),
		);
	});
});
