import { Octokit } from "octokit";

import { SystemFetchers } from "./types.js";

export interface SystemFetchersSettings {
	auth?: string;
	fetch?: typeof fetch;
}

export function createSystemFetchers({
	auth,
	fetch = globalThis.fetch,
}: SystemFetchersSettings): SystemFetchers {
	return {
		fetch,
		octokit: auth
			? new Octokit({
					auth,
					request: { fetch },
				})
			: undefined,
	};
}
