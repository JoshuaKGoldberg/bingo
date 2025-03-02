import { IntakeDirectory } from "bingo-fs";
import { describe, expect, it } from "vitest";

import { getSourceFromDirectory } from "./getSourceFromDirectory.js";

const fileContents = "...";

describe("getSourceFromPath", () => {
	it("throws an error when the requested path does not match any root directory", () => {
		const act = () =>
			getSourceFromDirectory(
				"/template",
				{
					"file.txt.hbs": [fileContents],
				},
				"incorrect",
			);

		expect(act).toThrowError(
			`Source 'incorrect' does not exist under '/template'.`,
		);
	});

	it("throws an error when the requested path does not match any child directory", () => {
		const act = () =>
			getSourceFromDirectory(
				"/template",
				{
					inner: {
						"file.txt.hbs": [fileContents],
					},
				},
				"inner/incorrect",
			);

		expect(act).toThrowError(
			`Source 'inner/incorrect' does not exist under '/template'.`,
		);
	});

	it("returns the file when the requested path is a file", () => {
		const actual = getSourceFromDirectory(
			"/template",
			{
				"file.txt.hbs": [fileContents],
			},
			"file.txt.hbs",
		);

		expect(actual).toEqual([fileContents]);
	});

	it("returns the directory when the requested path is a directory", () => {
		const directory: IntakeDirectory = {
			inner: {
				"file.txt.hbs": [fileContents],
			},
		};

		const actual = getSourceFromDirectory("/template", directory, "inner");

		expect(actual).toEqual(directory.inner);
	});
});
