import { createInput } from "bingo";
import { z } from "zod";

export const inputFromScript = createInput({
	args: [z.string()],
	async produce({ args, runner }) {
		return await runner(args[0]);
	},
});
