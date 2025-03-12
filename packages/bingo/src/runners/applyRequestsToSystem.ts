import { CreatedRequest } from "bingo-requests";

import { SystemContext } from "../types/system.js";
import { getRequestSender } from "./getRequestSender.js";

export async function applyRequestsToSystem(
	requests: CreatedRequest[],
	system: SystemContext,
) {
	await Promise.all(
		requests.map(async (request) => {
			const { id, send } = getRequestSender(request);

			system.display.item("request", id, { start: Date.now() });

			try {
				await send(system.fetchers);
			} catch (error) {
				system.display.item("request", id, { error });
			}

			system.display.item("request", id, { end: Date.now() });
		}),
	);
}
