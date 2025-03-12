import { CreatedRequest } from "bingo-requests";
import { SystemFetchers } from "bingo-systems";

export interface RequestSender {
	id: string;
	send: (fetchers: SystemFetchers) => Promise<void>;
}

export function getRequestSender(request: CreatedRequest): RequestSender {
	switch (request.type) {
		case "fetch":
			return {
				id: request.id ?? request.url,
				send: async (fetchers: SystemFetchers) => {
					await fetchers.fetch(request.url, request.init);
				},
			};

		case "octokit":
			return {
				id: request.id ?? request.endpoint,
				send: async (fetchers: SystemFetchers) => {
					await fetchers.octokit.request(
						request.endpoint,
						// TODO: I have no idea how to get this to type-check without the any.
						// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
						request.parameters as any,
					);
				},
			};
	}
}
