import { Block } from "../types/blocks.js";
import { BlockModifications } from "../types/settings.js";

export function applyBlockModifications<Options extends object>(
	initial: Block<object | undefined, Options>[],
	{ add = [], exclude = [] }: BlockModifications<Options> = {},
) {
	if (!add.length && !exclude.length) {
		return initial;
	}

	const blocks = new Set(initial);

	for (const added of add) {
		blocks.add(added);
	}

	for (const excluded of exclude) {
		blocks.delete(excluded);
	}

	return Array.from(blocks);
}
