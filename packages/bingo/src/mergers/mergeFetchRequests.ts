import { CreatedFetchRequest } from "bingo-requests";
import { withoutUndefinedProperties } from "without-undefined-properties";

export function mergeFetchRequests(
	allExisting: CreatedFetchRequest[] | undefined,
	added: CreatedFetchRequest,
): CreatedFetchRequest[] {
	if (!allExisting) {
		return [added];
	}

	for (let i = 0; i < allExisting.length; i++) {
		const existing = allExisting[i];
		if (existing.id !== added.id || existing.url !== added.url) {
			continue;
		}

		const merged: typeof existing = withoutUndefinedProperties({
			...existing,
			init:
				added.init || existing.init
					? Object.assign({}, existing.init, added.init)
					: undefined,
		});

		allExisting[i] = merged;

		return allExisting;
	}

	return [...allExisting, added];
}
