export interface RepositoryLocator {
	owner: string;
	repository: string;
}

type StringLike = boolean | number | string;

export function getRepositoryLocator(options: Record<string, unknown>) {
	if (!isStringLike(options.owner)) {
		throw new Error(
			`To run with --mode setup, --owner must be a string-like, not ${typeof options.owner}.`,
		);
	}

	if (!isStringLike(options.repository)) {
		throw new Error(
			`To run with --mode setup, --repository must be a string-like, not ${typeof options.repository}.`,
		);
	}

	return {
		owner: options.owner.toString(),
		repository: options.repository.toString(),
	};
}

function isStringLike(value: unknown): value is StringLike {
	return ["boolean", "number", "string"].includes(typeof value);
}
