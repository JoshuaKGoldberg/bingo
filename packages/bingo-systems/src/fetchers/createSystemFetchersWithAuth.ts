import { getGitHubAuthToken } from "get-github-auth-token";

import {
	createSystemFetchers,
	SystemFetchersSettings,
} from "./createSystemFetchers.js";
import { SystemFetchers } from "./types.js";

export async function createSystemFetchersWithAuth(
	settings?: Omit<SystemFetchersSettings, "auth">,
): Promise<SystemFetchers> {
	const auth = await getGitHubAuthToken();

	return createSystemFetchers({
		...settings,
		auth: auth.succeeded ? auth.token : undefined,
	});
}
