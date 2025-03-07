import { z } from "zod";

import { promptForOptionSchema } from "../prompts/promptForOptionSchema.js";

export interface RepositoryLocator {
	owner: string;
	repository: string;
}

type StringLike = boolean | number | string;

export async function getRepositoryLocator(
	{ owner: ownerRequested, repository }: Record<string, unknown>,
	offline: boolean | undefined,
) {
	const owner =
		ownerRequested || offline
			? ownerRequested
			: await promptForOptionSchema(
					"owner",
					z.string(),
					"GitHub organization or user the repository is underneath",
					undefined,
				);

	if (!isStringLike(owner)) {
		throw new Error(
			`To run with --mode setup, --owner must be a string-like, not ${typeof owner}.`,
		);
	}

	if (!isStringLike(repository)) {
		throw new Error(
			`To run with --mode setup, --repository must be a string-like, not ${typeof repository}.`,
		);
	}

	return {
		owner: owner.toString(),
		repository: repository.toString(),
	};
}

function isStringLike(value: unknown): value is StringLike {
	return ["boolean", "number", "string"].includes(typeof value);
}
