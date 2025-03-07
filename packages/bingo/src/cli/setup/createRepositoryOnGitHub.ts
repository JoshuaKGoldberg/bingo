import { SystemRunner } from "bingo-systems";
import { Result as ExecaResult } from "execa";
import { newGitHubRepository } from "new-github-repository";
import { Octokit } from "octokit";
import { z } from "zod";

import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { promptForOptionSchema } from "../prompts/promptForOptionSchema.js";
import { RepositoryLocator } from "./getRepositoryLocator.js";

export interface PartialRepositoryLocator {
	owner?: string;
	repository: string;
}

export async function createRepositoryOnGitHub(
	display: ClackDisplay,
	{ owner: requestedOwner, repository }: PartialRepositoryLocator,
	octokit: Octokit,
	runner: SystemRunner,
	template?: RepositoryLocator,
): Promise<RepositoryLocator | undefined> {
	const owner =
		requestedOwner ??
		stdoutIfNotError(await runner("gh config get user -h github.com")) ??
		(await promptForOptionSchema(
			"owner",
			z.string(),
			"GitHub organization or user the repository is underneath",
			undefined,
		));

	if (typeof owner !== "string") {
		return undefined;
	}

	const error = await runSpinnerTask(
		display,
		"Creating repository on GitHub",
		"Created repository on GitHub",
		async () => {
			await newGitHubRepository({ octokit, owner, repository, template });
		},
	);

	return error ? undefined : { owner, repository };
}

function stdoutIfNotError(value: Error | ExecaResult) {
	return value instanceof Error ? undefined : value.stdout;
}
