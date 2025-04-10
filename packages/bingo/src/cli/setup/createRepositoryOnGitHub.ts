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

export interface RepositoryCreationResult {
	offline?: boolean;
	remote?: Error | RepositoryLocator;
	warning?: string;
}

export interface RepositoryLocator extends PartialRepositoryLocator {
	owner: string;
}

const offlinePrefix = "Running in local-only mode.";

export async function createRepositoryOnGitHub<
	OptionsShape extends AnyShape,
	Refinements,
>(
	display: ClackDisplay,
	{ owner: requestedOwner, repository }: PartialRepositoryLocator,
	requestedOffline: boolean | undefined,
	octokit: Octokit,
	runner: SystemRunner,
	template: Template<OptionsShape, Refinements>,
): Promise<RepositoryCreationResult> {
	const hasStringLikeOwner = hasStringLikeOption(template.options, "owner");
	const hasStringLikeRepository = hasStringLikeOption(
		template.options,
		"repository",
	);

	if (!hasStringLikeOwner || !hasStringLikeRepository) {
		return {
			offline: true,
			warning: requestedOffline
				? undefined
				: `${offlinePrefix} Add string-like options.owner and options.repository schemas to enable creating a repository on GitHub.`,
		};
	}

	// We'll only want to create a repository if we're logged in.
	// getGitHubAuthToken is intentionally what Bingo uses to create an Octokit.
	const authToken = await getGitHubAuthToken();
	if (!authToken.succeeded) {
		return {
			offline: true,
			warning: `${offlinePrefix} To push to GitHub, log in with the GitHub CLI (cli.github.com) or run with a GH_TOKEN process environment variable.`,
		};
	}

	const ownerRaw =
		requestedOwner ??
		stdoutIfNotError(await runner("gh config get user -h github.com")) ??
		(await promptForOptionSchema(
			"owner",
			template.options.owner,
			"organization or username owning the repository",
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

	return error
		? {
				offline: true,
				remote: error,
			}
		: {
				offline: false,
				remote: { owner, repository },
			};
}

function hasStringLikeOption(options: AnyShape, key: string): boolean {
	return key in options && isStringLikeSchema(options[key]);
}

function stdoutIfNotError(value: ExecaError | ExecaResult) {
	return value instanceof Error ? undefined : value.stdout;
}
