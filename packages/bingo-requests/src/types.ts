import { Endpoints, RequestParameters } from "@octokit/types";

export interface CreatedRequestBase {
	/**
	 * Unique ID for logging and to differentiate between requests to the same url.
	 */
	id?: string;

	/**
	 * Whether to skip logging errors if the request fails.
	 */
	silent?: boolean;
}

/**
 * Request to be send with fetch().
 */
export interface CreatedFetchRequest extends CreatedRequestBase {
	/**
	 * Any options to be sent as the second parameter to fetch().
	 */
	init?: RequestInit;

	type: "fetch";

	/**
	 * URL to use as the first parameter to fetch().
	 */
	url: string;
}

/**
 * Request to be send with GitHub's Octokit to an API endpoint.
 * @template TargetEndpoint GitHub API endpoint, such as `POST /repos/{owner}/{repo}/labels`.
 */
export interface CreatedOctokitRequest<
	TargetEndpoint extends GitHubEndpoint = GitHubEndpoint,
> {
	/**
	 * Octokit endpoint to send to.
	 */
	endpoint: TargetEndpoint;

	/**
	 * Parameter data to attach to the request.
	 */
	parameters: Endpoints[TargetEndpoint]["parameters"] & RequestParameters;

	type: "octokit";
}

export type CreatedRequest = CreatedFetchRequest | CreatedOctokitRequest;

export type GitHubEndpoint = keyof Endpoints;
