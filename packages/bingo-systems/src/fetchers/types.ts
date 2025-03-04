import { Octokit } from "octokit";

/**
 * APIs to send network requests.
 */
export interface SystemFetchers {
	/**
	 * Standard fetch function to send requests.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}
	 */
	fetch: typeof fetch;

	/**
	 * Octokit.js instance wrapping the same `fetch` function.
	 * @see {@link https://octokit.github.io/rest.js}
	 */
	octokit: Octokit;
}
