import { isLocalPath } from "./utils.js";

export function findPositionalFrom(positionals: string[]) {
	const from = positionals.find((positional) => !positional.startsWith("-"));

	return from && !isLocalPath(from) && !from.startsWith("create-")
		? `create-${from}`
		: from;
}
