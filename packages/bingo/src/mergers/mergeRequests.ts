import { CreatedRequest } from "../types/creations.js";

export function mergeRequests(
	firsts: CreatedRequest[],
	seconds: CreatedRequest[],
) {
	const byId = new Map<string, CreatedRequest>();

	for (const request of [...firsts, ...seconds]) {
		byId.set(request.id, request);
	}

	return Array.from(byId.values());
}
