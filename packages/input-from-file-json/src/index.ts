import { createInput } from "bingo";
import { inputFromFile } from "input-from-file";

export const inputFromFileJSON = createInput({
	args: inputFromFile.args,
	async produce({ args, take }) {
		const text = await take(inputFromFile, ...args);

		if (text instanceof Error) {
			return text;
		}

		try {
			return JSON.parse(text) as unknown;
		} catch (error) {
			return error as SyntaxError;
		}
	},
});
