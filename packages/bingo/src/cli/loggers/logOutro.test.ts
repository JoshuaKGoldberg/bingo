import chalk from "chalk";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { logOutro } from "./logOutro.js";

const mockOutro = vi.fn();
const mockConsoleLog = vi.fn();
const mockPromptWarn = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return {
			warn: mockPromptWarn,
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
		expect(mockPromptWarn).not.toHaveBeenCalled();
		expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
	});

	describe("items", () => {
		test("empty items", () => {
			logOutro("Bye!", { items: {} });

			expect(mockPromptWarn).not.toHaveBeenCalled();
			expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
		});

		test("items", () => {
			logOutro("Bye!", {
				items: {
					groupA: {
						itemA: {},
						itemB: { error: new Error("Oh no!") },
					},
				},
			});

			expect(mockPromptWarn.mock.calls).toEqual([
				[
					`The ${chalk.red("itemB")} groupA failed. You should re-run it and fix its complaints.\nError: Oh no!`,
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
