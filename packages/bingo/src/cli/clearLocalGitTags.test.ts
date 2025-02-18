import { describe, expect, it, vi } from "vitest";

import { clearLocalGitTags } from "./clearLocalGitTags.js";

describe("clearLocalGitTags", () => {
	it("deletes tags when git tag -l has stdout", async () => {
		const runner = vi.fn().mockResolvedValueOnce({ stdout: "a\nb\nc" });

		await clearLocalGitTags(runner);

		expect(runner).toHaveBeenCalledTimes(2);
		expect(runner).toHaveBeenCalledWith(`git tag -d a b c`);
	});

	it("does not attempt to delete tags when git tag -l has no stdout", async () => {
		const runner = vi.fn().mockResolvedValueOnce({ stdout: "" });

		await clearLocalGitTags(runner);

		expect(runner).toHaveBeenCalledTimes(1);
	});
});
