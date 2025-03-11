import { SystemRunner } from "bingo-systems";
import { ExecaError, Result as ExecaResult } from "execa";
import { getGitHubAuthToken } from "get-github-auth-token";
import { newGitHubRepository } from "new-github-repository";
import { Octokit } from "octokit";

import { AnyShape } from "../../types/shapes.js";
import { Template } from "../../types/templates.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { promptForOptionSchema } from "../prompts/promptForOptionSchema.js";
import { isStringLikeSchema } from "../schemas/isStringLikeSchema.js";

export interface PartialRepositoryLocator {
	owner?: string;
	repository: string;
}

export interface RepositoryLocator extends PartialRepositoryLocator {
	owner: string;
}

export async function createRepositoryOnGitHub<
	OptionsShape extends AnyShape,
	Refinements,
>(
	display: ClackDisplay,
	{ owner: requestedOwner, repository }: PartialRepositoryLocator,
	octokit: Octokit,
	runner: SystemRunner,
	template: Template<OptionsShape, Refinements>,
): Promise<Error | RepositoryLocator | undefined> {
	const hasStringLikeOwner = hasStringLikeOption(template.options, "owner");
	const hasStringLikeRepository = hasStringLikeOption(
		template.options,
		"repository",
	);

	if (!hasStringLikeOwner) {
		return new Error(
			hasStringLikeRepository
				? `To run with --mode setup and not --offline, options.owner must be a string-like schema.`
				: `To run with --mode setup and not --offline, options.owner and options.repository must be string-like schemas.`,
		);
	}

	if (!hasStringLikeRepository) {
		return new Error(
			`To run with --mode setup and not --offline, options.repository must be a string-like schema.`,
		);
	}

	// We'll only want to create a repository if we're logged in.
	// getGitHubAuthToken is intentionally what Bingo uses to create an Octokit.
	const authToken = await getGitHubAuthToken();
	if (!authToken.succeeded) {
		return undefined;
	}

	const ownerRaw =
		requestedOwner ??
		stdoutIfNotError(await runner("gh config get user -h github.com")) ??
		(await promptForOptionSchema(
			"owner",
			template.options.owner,
			"GitHub organization or user the repository is underneath",
			undefined,
		));

	const owner = String(ownerRaw);
	const error = await runSpinnerTask(
		display,
		"Creating repository on GitHub",
		"Created repository on GitHub",
		async () => {
			await newGitHubRepository({
				octokit,
				owner,
				repository,
				template: template.about?.repository,
			});
		},
	);

	return error || { owner, repository };
}

function hasStringLikeOption(options: AnyShape, key: string): boolean {
	return key in options && isStringLikeSchema(options[key]);
}

function stdoutIfNotError(value: ExecaError | ExecaResult) {
	return value instanceof Error ? undefined : value.stdout;
}
