import { CreatedRequest } from "../types/creations.js";
import { SystemContext } from "../types/system.js";

export async function applyRequestsToSystem(
	requests: CreatedRequest[],
	system: Pick<SystemContext, "display" | "fetchers">,
) {
	await Promise.all(
		requests.map(async (request) => {
			system.display.item("request", request.id, { start: Date.now() });

			try {
				await request.send(system.fetchers);
			} catch (error) {
				system.display.item("request", request.id, { error });
			}

			system.display.item("request", request.id, { end: Date.now() });
		}),
	);
}
