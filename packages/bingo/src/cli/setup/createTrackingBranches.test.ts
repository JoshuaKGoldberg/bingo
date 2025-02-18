import { describe, expect, test, vi } from "vitest";

import { createTrackingBranches } from "./createTrackingBranches.js";

describe("createTrackingBranches", () => {
	test("commands", async () => {
		const runner = vi.fn();

		await createTrackingBranches(
			{ owner: "TestOwner", repository: "test-repository" },
			runner,
		);

		expect(runner.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "git init",
			  ],
			  [
			    "git remote add origin https://github.com/TestOwner/test-repository",
			  ],
			]
		`);
	});
});
