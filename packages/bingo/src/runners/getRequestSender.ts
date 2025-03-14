import { CreatedRequest } from "bingo-requests";
import { SystemFetchers } from "bingo-systems";

export interface RequestSender {
	id: string;
	send: () => Promise<void>;
}

export function getRequestSender(
	fetchers: SystemFetchers,
	request: CreatedRequest,
): RequestSender | undefined {
	switch (request.type) {
		case "fetch":
			return {
				id: request.id ?? request.url,
				send: async () => {
					await fetchers.fetch(request.url, request.init);
				},
			};

		case "octokit": {
			const { octokit } = fetchers;
			return (
				octokit && {
					id: request.id ?? request.endpoint,
					send: async () => {
						await octokit.request(
							request.endpoint,
							// TODO: I have no idea how to get this to type-check without the any.
							// https://github.com/JoshuaKGoldberg/bingo/issues/286
							// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
							request.parameters as any,
						);
					},
				}
			);
		}
	}
}
