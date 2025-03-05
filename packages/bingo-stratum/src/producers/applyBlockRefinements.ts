import { Block } from "../types/blocks.js";
import { BlockRefinements } from "../types/refinements.js";
import { createBlockExclusionOption } from "../utils/createBlockExclusionOption.js";

export function applyBlockRefinements<Options extends object>(
	blocksInitial: Block<object | undefined, Options>[],
	options: Options,
	{ add = [], exclude = [] }: BlockRefinements<Options> = {},
) {
	const exclusionOptions = new Set(
		Object.entries(options)
			.filter(([key, value]) => key.startsWith("exclude-") && !!value)
			.map(([key]) => key),
	);

	if (!add.length && !exclude.length && !exclusionOptions.size) {
		return blocksInitial;
	}

	const blocksRefined = new Set(
		blocksInitial.filter(
			(block) =>
				block.about?.name &&
				!exclusionOptions.has(createBlockExclusionOption(block.about.name)),
		),
	);

	for (const added of add) {
		blocksRefined.add(added);
	}

	for (const excluded of exclude) {
		blocksRefined.delete(excluded);
	}

	return Array.from(blocksRefined);
}
