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
	let knownLabelsLength = 0;

	// Labels aren't all created at once: GitHub populates them asynchronously.
	// We need to wait until the number of labels stops changing.
	// https://github.com/JoshuaKGoldberg/bingo/issues/251
	let matchedLabelsLength = false;

	// We limit retries case of GitHub slowness or an org with no default labels.
	// Initial testing on a fast network found the maximum needed to be ~20-25.
	for (let i = 0; i < 35; i += 1) {
		const { data: labels } = await octokit.request(
			"GET /repos/{owner}/{repo}/labels",
			{
				owner: target.owner,
				repo: target.repository,
			},
		);

		if (knownLabelsLength && labels.length === knownLabelsLength) {
			if (matchedLabelsLength) {
				return;
			}

			matchedLabelsLength = true;
			continue;
		}

		knownLabelsLength = labels.length;
		matchedLabelsLength = false;
	}
}
