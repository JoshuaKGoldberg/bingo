import { testInput } from "bingo-testers";
import { describe, expect, it } from "vitest";

import { inputFromFile } from "./index.js";

describe("inputFromFile", () => {
	it("returns the file's text when it exists", async () => {
		const text = "abc123";

		const actual = await testInput(inputFromFile, {
			args: ["file.txt"],
			fs: {
				readFile: () => Promise.resolve(text),
			},
		});

		expect(actual).toBe(text);
	});

	it("returns an error when reading the file rejects with an error", async () => {
		const error = new Error("Oh no!");
		const actual = await testInput(inputFromFile, {
			args: ["file.txt"],
			fs: {
				readFile: () => Promise.reject(error),
			},
		});

		expect(actual).toEqual(error);
	});

	it("returns an error when reading the file rejects with a string", async () => {
		const error = new Error("Oh no!");
		const actual = await testInput(inputFromFile, {
			args: ["file.txt"],
			fs: {
				// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
				readFile: () => Promise.reject(error.message),
			},
		});

		expect(actual).toEqual(error);
	});
});
