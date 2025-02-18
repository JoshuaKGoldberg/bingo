import { getGitHubAuthToken } from "get-github-auth-token";

import {
	createSystemContext,
	SystemContextSettings,
} from "./createSystemContext.js";

export async function createSystemContextWithAuth(
	settings: Pick<
		SystemContextSettings,
		"auth" | "directory" | "fetchers" | "offline"
	>,
) {
	const authToken =
		settings.fetchers?.octokit || settings.auth || settings.offline
			? undefined
			: await getGitHubAuthToken();
	const auth = authToken?.succeeded ? authToken.token : settings.auth;

	return createSystemContext({ ...settings, auth });
}
