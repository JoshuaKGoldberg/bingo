import { describe, expect, it } from "vitest";

import { getRepositoryLocator } from "./getRepositoryLocator.js";

const owner = "TestOwner";
const repository = "test-repository";

describe("getRepositoryLocator", () => {
	it("throws an error when the options are missing owner", () => {
		const options = { repository };

		expect(() => {
			getRepositoryLocator(options);
		}).toThrowError(
			`To run with --mode setup, --owner must be a string-like, not undefined.`,
		);
	});

	it("throws an error when the options have an invalid owner", () => {
		const options = { owner: [1, 2, 3], repository };

		expect(() => {
			getRepositoryLocator(options);
		}).toThrowError(
			`To run with --mode setup, --owner must be a string-like, not object.`,
		);
	});

	it("throws an error when the options are missing repository", () => {
		const options = { owner };

		expect(() => {
			getRepositoryLocator(options);
		}).toThrowError(
			`To run with --mode setup, --repository must be a string-like, not undefined.`,
		);
	});

	it("throws an error when the options have an invalid repository", () => {
		const options = { owner, repository: [1, 2, 3] };

		expect(() => {
			getRepositoryLocator(options);
		}).toThrowError(
			`To run with --mode setup, --repository must be a string-like, not object.`,
		);
	});

	it("returns the options when the options have owner and repository as strings", () => {
		const options = { owner, repository };

		expect(getRepositoryLocator(options)).toEqual(options);
	});

	it("returns the options as strings when the options have owner and repository as numbers", () => {
		const options = { owner: 123, repository: 456 };

		expect(getRepositoryLocator(options)).toEqual({
			owner: "123",
			repository: "456",
		});
	});
});
