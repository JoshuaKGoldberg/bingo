import { Octokit } from "octokit";

export interface SystemFetchers {
	fetch: typeof fetch;
	octokit: Octokit;
}
