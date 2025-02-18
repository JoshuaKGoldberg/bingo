import { testInput } from "bingo-testers";
import { describe, expect, it, vi } from "vitest";

import { inputFromScript } from "./index.js";

describe("inputFromScript", () => {
	it("returns the result from running the command", async () => {
		const command = "echo 123";
		const expected = { stdout: "123" };
		const runner = vi.fn().mockResolvedValue(expected);

		const actual = await testInput(inputFromScript, {
			args: { command },
			runner,
		});

		expect(actual).toBe(expected);
		expect(runner).toHaveBeenCalledWith(command);
	});
});
