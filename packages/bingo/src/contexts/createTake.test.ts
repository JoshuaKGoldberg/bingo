import { createSystemFetchers } from "bingo-systems";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createInput } from "../creators/createInput.js";
import { createTake } from "./createTake.js";

const createMockSystem = () => ({
	fetchers: createSystemFetchers({
		fetch: vi.fn(),
	}),
	fs: {
		readDirectory: vi.fn(),
		readFile: vi.fn(),
	},
	runner: vi.fn(),
});

describe("createTake", () => {
	describe("without args", () => {
		it("produces a getter when called the first time", () => {
			const value = { inner: 123 };
			const take = createTake(createMockSystem());
			const produce = vi.fn().mockReturnValueOnce(value);
			const input = createInput({ produce });

			const getter = take(input);

			expect(getter()).toBe(value);
			expect(produce).toHaveBeenCalledOnce();
		});

		it("returns the same value from the getter when the getter is called multiple times", () => {
			const value = { inner: 123 };
			const take = createTake(createMockSystem());
			const produce = vi.fn().mockReturnValueOnce(value);
			const input = createInput({ produce });

			const getter = take(input);

			getter();

			expect(getter()).toBe(value);
			expect(produce).toHaveBeenCalledOnce();
		});

		it("produces the same cached getter when called the second time", () => {
			const value = { inner: 123 };
			const take = createTake(createMockSystem());
			const produce = vi.fn().mockReturnValueOnce(value);
			const input = createInput({ produce });

			take(input);

			const getter = take(input);

			expect(getter()).toBe(value);
			expect(produce).toHaveBeenCalledOnce();
		});

		it("produces the same result when two getters are created and called once", () => {
			const value = { inner: 123 };
			const take = createTake(createMockSystem());
			const produce = vi.fn().mockReturnValueOnce(value);
			const input = createInput({ produce });

			const getterFirst = take(input);
			const actualFirst = getterFirst();

			const getterSecond = take(input);

			expect(getterSecond()).toBe(actualFirst);

			expect(produce).toHaveBeenCalledOnce();
		});

		it("passes args when provided and in the schema", () => {
			const take = createTake(createMockSystem());
			const input = createInput({
				args: {
					value: z.number(),
				},
				produce: ({ args }) => args.value * 2,
			});

			const getter = take(input, { value: 123 });

			expect(getter()).toBe(246);
		});
	});
});
