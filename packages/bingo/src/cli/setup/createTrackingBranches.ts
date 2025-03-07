import { SystemRunner } from "bingo-systems";

import { RepositoryLocator } from "./createRepositoryOnGitHub.js";

export async function createTrackingBranches(
	remote: RepositoryLocator | undefined,
	runner: SystemRunner,
) {
	await runner("git init");

	if (remote) {
		await runner(
			`git remote add origin https://github.com/${remote.owner}/${remote.repository}`,
		);
	}
}
