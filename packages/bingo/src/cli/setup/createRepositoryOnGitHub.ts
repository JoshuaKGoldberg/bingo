import { SystemRunner } from "bingo-systems";
import { Result as ExecaResult } from "execa";
import { newGitHubRepository } from "new-github-repository";
import { Octokit } from "octokit";
import { z } from "zod";

import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { promptForOptionSchema } from "../prompts/promptForOptionSchema.js";

export interface PartialRepositoryLocator {
	owner?: string;
	repository: string;
}

export interface RepositoryLocator extends PartialRepositoryLocator {
	owner: string;
}

export async function createRepositoryOnGitHub(
	display: ClackDisplay,
	{ owner: requestedOwner, repository }: PartialRepositoryLocator,
	octokit: Octokit,
	runner: SystemRunner,
	template?: RepositoryLocator,
): Promise<Error | RepositoryLocator | undefined> {
	const owner =
		requestedOwner ??
		stdoutIfNotError(await runner("gh config get user -h github.com")) ??
		(await promptForOptionSchema(
			"owner",
			z.string(),
			"GitHub organization or user the repository is underneath",
			undefined,
		));

	if (!isStringLike(owner)) {
		return new Error(
			`To run with --mode setup, --owner must be a string-like, not ${typeof owner}.`,
		);
	}

	if (!isStringLike(repository)) {
		return new Error(
			`To run with --mode setup, --repository must be a string-like, not ${typeof repository}.`,
		);
	}

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

function isStringLike(value: unknown): value is boolean | number | string {
	return ["boolean", "number", "string", "undefined"].includes(typeof value);
}

function stdoutIfNotError(value: Error | ExecaResult) {
	return value instanceof Error ? undefined : value.stdout;
}
