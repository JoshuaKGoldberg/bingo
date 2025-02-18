import { SystemRunner } from "bingo-systems";

import { RepositoryLocator } from "./getRepositoryLocator.js";

export async function createTrackingBranches(
	{ owner, repository }: RepositoryLocator,
	runner: SystemRunner,
) {
	for (const command of [
		`git init`,
		`git remote add origin https://github.com/${owner}/${repository}`,
	]) {
		await runner(command);
	}
}
