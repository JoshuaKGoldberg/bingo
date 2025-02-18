import { createSystemFetchers } from "./createSystemFetchers.js";
import { SystemFetchers } from "./types.js";

export function createSystemFetchersOffline(): SystemFetchers {
	return createSystemFetchers({
		fetch: () =>
			Promise.reject(
				new Error(
					"Offline specified. This request should be caught by its Input.",
				),
			),
	});
}
