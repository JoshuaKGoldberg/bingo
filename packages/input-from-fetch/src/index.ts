import { createInput } from "bingo";
import { z } from "zod";

export const inputFromFetch = createInput({
	args: {
		options: z
			.object({
				// TODO: fill out!
				// https://github.com/bingo-js/bingo/issues/282
			})
			.optional(),
		resource: z.string(),
	},
	async produce({ args, fetchers, offline }) {
		if (offline) {
			return undefined;
		}

		try {
			return await fetchers.fetch(args.resource, args.options);
		} catch (error) {
			return error as Error;
		}
	},
});
