import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { applyRequestsToSystem } from "./applyRequestsToSystem.js";

function createStubSystem() {
	return {
		display: {
			item: vi.fn(),
			log: vi.fn(),
		},
		fetchers: {
			fetch: vi.fn(),
			octokit: {} as Octokit,
		},
	};
}

describe("applyRequestsToSystem", () => {
	it("displays the error when a request rejects", async () => {
		const error = new Error();
		const id = "abc";
		const system = createStubSystem();

		await applyRequestsToSystem(
			[
				{
					id,
					send: vi.fn().mockRejectedValueOnce(error),
				},
			],
			system,
		);

		expect(system.display.item.mock.calls).toEqual([
			["request", id, { start: expect.any(Number) }],
			["request", id, { error }],
			["request", id, { end: expect.any(Number) }],
		]);
	});
});
