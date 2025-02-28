import { createSystemFetchers } from "bingo-systems";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createInput } from "./createInput.js";

describe("createInput", () => {
	test("production without args", () => {
		const expected = 123;

		const input = createInput({
			produce: () => expected,
		});

		const actual = input({
			fetchers: createSystemFetchers({ fetch: vi.fn() }),
			fs: {
				readDirectory: vi.fn(),
				readFile: vi.fn(),
			},
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toBe(expected);
	});

	test("production with one arg", () => {
		const added = 234;

		const input = createInput({
			args: [z.number()],
			produce: ({ args }) => added + args[0],
		});

		const actual = input({
			args: [1000],
			fetchers: createSystemFetchers({ fetch: vi.fn() }),
			fs: {
				readDirectory: vi.fn(),
				readFile: vi.fn(),
			},
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toBe(1234);
	});
});
