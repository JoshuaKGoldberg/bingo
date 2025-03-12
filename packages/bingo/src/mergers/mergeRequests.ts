import {
	CreatedFetchRequest,
	CreatedOctokitRequest,
	CreatedRequest,
} from "bingo-requests";

import { groupBy } from "../utils/groupBy.js";
import { mergeFetchRequests } from "./mergeFetchRequests.js";
import { mergeOctokitRequests } from "./mergeOctokitRequests.js";

export function mergeRequests(
	firsts: CreatedRequest[],
	seconds: CreatedRequest[],
) {
	const byType = groupBy(firsts, (request) => request.type);

	for (const added of seconds) {
		switch (added.type) {
			case "fetch":
				byType.fetch = mergeFetchRequests(
					byType.fetch as CreatedFetchRequest[],
					added,
				);
				break;

			case "octokit":
				byType.octokit = mergeOctokitRequests(
					byType.octokit as CreatedOctokitRequest[],
					added,
				);
				break;
		}
	}

	return Object.values(byType).flat();
}
