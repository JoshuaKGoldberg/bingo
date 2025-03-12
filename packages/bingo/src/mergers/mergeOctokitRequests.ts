import { CreatedOctokitRequest } from "bingo-requests";
import { withoutUndefinedProperties } from "without-undefined-properties";

export function mergeOctokitRequests(
	allExisting: CreatedOctokitRequest[] | undefined,
	added: CreatedOctokitRequest,
): CreatedOctokitRequest[] {
	if (!allExisting) {
		return [added];
	}

	for (let i = 0; i < allExisting.length; i++) {
		const existing = allExisting[i];
		if (added.endpoint !== existing.endpoint || added.id !== existing.id) {
			continue;
		}

		const merged: typeof existing = withoutUndefinedProperties({
			...existing,
			parameters: Object.assign({}, existing.parameters, added.parameters),
		});

		allExisting[i] = merged;

		return allExisting;
	}

	return [...allExisting, added];
}
