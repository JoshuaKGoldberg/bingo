import { describe, expect, it } from "vitest";

import { awaitLazyProperties } from "./awaitLazyProperties.js";

describe("awaitLazyProperties", () => {
	it("returns a property directly when it is not a function", async () => {
		const actual = await awaitLazyProperties({ value: "abc" });

		expect(actual).toEqual({ value: "abc" });
	});

	it("returns a property's return directly when it is a function", async () => {
		const actual = await awaitLazyProperties({ value: () => "abc" });

		expect(actual).toEqual({ value: "abc" });
	});

	it("returns a property's await return when it is an asynchronous function", async () => {
		const actual = await awaitLazyProperties({
			value: () => Promise.resolve("abc"),
		});

		expect(actual).toEqual({ value: "abc" });
	});

	it("starts tasks immediately when multiple properties are asynchronous functions", async () => {
		let iteration = 0;

		async function returnStartIteration() {
			const current = iteration;
			await Promise.resolve();
			iteration += 1;
			return current;
		}

		const actual = await awaitLazyProperties({
			first: returnStartIteration,
			second: returnStartIteration,
		});

		expect(actual).toEqual({ first: 0, second: 0 });
	});
});
