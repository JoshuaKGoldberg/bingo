import { SystemFetchers } from "bingo-systems";
import { Octokit } from "octokit";

import { Fetch } from "./types.js";
import { createFailingFunction } from "./utils.js";

export function createMockFetchers(
	fetch: Fetch = createFailingFunction("fetch", "an input"),
): SystemFetchers {
	return {
		fetch,
		octokit: new Octokit({ request: { fetch } }),
	};
}
