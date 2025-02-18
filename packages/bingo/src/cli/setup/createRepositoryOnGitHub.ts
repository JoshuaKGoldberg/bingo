import { Octokit } from "octokit";

import { RepositoryLocator } from "./getRepositoryLocator.js";

export async function createRepositoryOnGitHub(
	target: RepositoryLocator,
	octokit: Octokit,
	source?: RepositoryLocator,
) {
	if (source) {
		await octokit.rest.repos.createUsingTemplate({
			name: target.repository,
			owner: target.owner,
			template_owner: source.owner,
			template_repo: source.repository,
		});
	} else {
		const currentUser = await octokit.rest.users.getAuthenticated();

		if (currentUser.data.login === target.owner) {
			await octokit.rest.repos.createForAuthenticatedUser({
				name: target.repository,
			});
		} else {
			await octokit.rest.repos.createInOrg({
				name: target.repository,
				org: target.owner,
			});
		}
	}
}
