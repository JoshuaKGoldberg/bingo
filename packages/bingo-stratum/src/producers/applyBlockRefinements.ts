import { Block } from "../types/blocks.js";
import { BlockRefinements } from "../types/refinements.js";

export function applyBlockRefinements<Options extends object>(
	initial: Block<object | undefined, Options>[],
	{ add = [], exclude = [] }: BlockRefinements<Options> = {},
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
