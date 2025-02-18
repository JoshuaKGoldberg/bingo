import { describe, expect, it } from "vitest";

import { createSystemFetchersOffline } from "./createSystemFetchersOffline.js";

describe("createSystemFetchersOffline", () => {
	it("rejects when called", async () => {
		const fetchers = createSystemFetchersOffline();

		await expect(
			async () => await fetchers.fetch(""),
		).rejects.toMatchInlineSnapshot(
			`[Error: Offline specified. This request should be caught by its Input.]`,
		);
	});
});
