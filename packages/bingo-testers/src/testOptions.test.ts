import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { testOptions } from "./testOptions.js";

describe("testOptions", () => {
	it("returns context.options directly when base.prepare is undefined", async () => {
		const options = { value: "abc" };

		const actual = await testOptions(
			{
				options: {
					value: z.string(),
				},
			},
			{ options },
		);

		expect(actual).toBe(options);
	});

	it("uses an options value from context when prepare also creates a value for it", async () => {
		const value = "provided";
		const getValue = vi.fn().mockResolvedValueOnce("default");

		const actual = await testOptions(
			{
				options: {
					value: z.string(),
				},
				prepare() {
					return {
						value: getValue,
					};
				},
			},
			{
				options: { value },
			},
		);

		expect(actual).toEqual({ value });
		expect(getValue).not.toHaveBeenCalled();
	});

	it("passes options to prepare when provided in context", async () => {
		const actual = await testOptions(
			{
				options: {
					first: z.string(),
					second: z.string(),
				},
				prepare({ options }) {
					return {
						second: () => Promise.resolve(String(options.first) + "!"),
					};
				},
			},
			{
				options: { first: "abc" },
			},
		);

		expect(actual).toEqual({
			first: "abc",
			second: "abc!",
		});
	});

	it("throws an error when prepare calls log and log is not provided", async () => {
		const act = async () =>
			await testOptions({
				options: {},
				prepare({ log }) {
					log("message");
					return {};
				},
			});

		await expect(act).rejects.toEqual(
			new Error(
				`Context property 'log' was used by prepare() but not provided.`,
			),
		);
	});

	it("calls the provided log when prepare calls log and log is provided", async () => {
		const data = "message";
		const log = vi.fn();

		await testOptions(
			{
				options: {},
				prepare({ log }) {
					log(data);
					return {};
				},
			},
			{ log },
		);

		expect(log).toHaveBeenCalledWith(data);
	});

	it("throws an error when prepare calls take and take is not provided", async () => {
		const act = async () =>
			await testOptions({
				options: {},
				prepare({ take }) {
					take(vi.fn());
					return {};
				},
			});

		await expect(act).rejects.toEqual(
			new Error(
				`Context property 'take' was used by prepare() but not provided.`,
			),
		);
	});

	it("calls the provided take when prepare calls take and take is provided", async () => {
		const input = vi.fn();
		const take = vi.fn();

		await testOptions(
			{
				options: {},
				prepare({ take }) {
					take(input);
					return {};
				},
			},
			{ take },
		);

		expect(take).toHaveBeenCalledWith(input);
	});
});
