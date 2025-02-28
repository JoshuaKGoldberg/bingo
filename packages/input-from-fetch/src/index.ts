import { createInput } from "bingo";
import { z } from "zod";

export const inputFromFetch = createInput({
	args: [
		z.string(),
		z
			.object({
				// TODO: fill out!
			})
			.default({}),
	],
	async produce({ args, fetchers, offline }) {
		if (offline) {
			return undefined;
		}

		try {
			return await fetchers.fetch(args[0], args[1]);
		} catch (error) {
			return error as Error;
		}
	},
});
