import { createInput } from "bingo";
import { z } from "zod";

export const inputFromFile = createInput({
	args: [z.string()],
	async produce({ args, fs }) {
		try {
			return await fs.readFile(args[0]);
		} catch (error) {
			return error instanceof Error ? error : new Error(error as string);
		}
	},
});
