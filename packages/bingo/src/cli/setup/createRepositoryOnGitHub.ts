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

	// GitHub asynchronously initializes default repo metadata such as labels.
	// There's no built-in API to determine whether initialization is done,
	// but we can approximate that by polling for whether labels are created.
	// https://github.com/JoshuaKGoldberg/bingo/issues/243
	// On the off chance the repository's organization has no default labels,
	// we only retry up to 10 times.
	for (let i = 0; i < 10; i += 1) {
		const response = await octokit.request("GET /repos/{owner}/{repo}/labels", {
			owner: target.owner,
			repo: target.repository,
		});

		if (response.data.length) {
			break;
		}
	}
}
