import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { createSystemFetchers } from "./createSystemFetchers.js";

describe("createSystemFetchers", () => {
	it("returns an object with only fetch when no auth is provided", () => {
		const fetchers = createSystemFetchers({});

		expect(fetchers).toEqual({
			fetch: globalThis.fetch,
			octokit: undefined,
		});
	});

	it("returns an object with fetch and octokit when auth is provided", () => {
		const fetchers = createSystemFetchers({ auth: "abc123" });

		expect(fetchers).toEqual({
			fetch: globalThis.fetch,
			octokit: expect.any(Octokit),
		});
	});

	it("returns an object with the custom fetch when fetch is provided", () => {
		const fetch = vi.fn();
		const fetchers = createSystemFetchers({ fetch });

		expect(fetchers).toEqual({ fetch });
	});

	it("returns an object with the custom fetch and octokit when auth and fetch are provided", () => {
		const auth = "abc123";
		const fetch = vi.fn();
		const fetchers = createSystemFetchers({ auth, fetch });

		expect(fetchers).toEqual({
			fetch,
			octokit: expect.any(Octokit),
		});
	});
});
