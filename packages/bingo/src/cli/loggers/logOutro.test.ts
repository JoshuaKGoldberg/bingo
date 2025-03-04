import chalk from "chalk";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { logOutro } from "./logOutro.js";

const mockOutro = vi.fn();
const mockConsoleLog = vi.fn();
const mockPromptError = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return {
			error: mockPromptError,
		};
	},
	get outro() {
		return mockOutro;
	},
}));

describe("logOutro", () => {
	beforeEach(() => {
		console.log = mockConsoleLog;
	});

	test("no errata", () => {
		logOutro("Bye!");

		expect(mockConsoleLog).not.toHaveBeenCalled();
		expect(mockPromptError).not.toHaveBeenCalled();
		expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
	});

	describe("items", () => {
		test("does not log an error items have no error", () => {
			logOutro("Bye!", { items: {} });

			expect(mockPromptError).not.toHaveBeenCalled();
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});

		test("logs an error stack when an item has an Error error", () => {
			logOutro("Bye!", {
				items: {
					groupA: {
						itemA: {},
						itemB: { error: new Error("Oh no!") },
					},
				},
			});

			expect(mockPromptError.mock.calls).toEqual([
				[
					expect.stringContaining(
						`The ${chalk.red("itemB")} groupA failed. You should re-run it and fix its complaints.\nError: Oh no!`,
					),
				],
			]);
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});

		test("logs an error stack when an item has a string error", () => {
			logOutro("Bye!", {
				items: {
					groupA: {
						itemA: {},
						itemB: { error: "Oh no!" },
					},
				},
			});

			expect(mockPromptError.mock.calls).toEqual([
				[
					`The ${chalk.red("itemB")} groupA failed. You should re-run it and fix its complaints.\nOh no!`,
				],
			]);
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});
	});

	describe("suggestions", () => {
		test("empty suggestions", () => {
			logOutro("Bye!", { suggestions: [] });

			expect(mockConsoleLog).not.toHaveBeenCalled();
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});

		test("suggestions", () => {
			logOutro("Bye!", { suggestions: ["a", "b", "c"] });

			expect(mockConsoleLog.mock.calls).toEqual([
				["Be sure to:"],
				[],
				["a"],
				["b"],
				["c"],
				[],
			]);
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});
	});
});
