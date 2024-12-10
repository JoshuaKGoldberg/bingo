import { createInput } from "create";
import { z } from "zod";

export const inputFile = createInput({
	args: {
		filePath: z.string(),
	},
	async produce({ args, fs }) {
		try {
			return await fs.readFile(args.filePath);
		} catch (error) {
			return error instanceof Error ? error : new Error(error as string);
		}
	},
});
