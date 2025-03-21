import { CachedFactory } from "cached-factory";

import { Block } from "../types/blocks.js";
import { BlockRefinements } from "../types/refinements.js";

interface BlockRefinement {
	add?: boolean;
	exclude?: boolean;
}

type BlockWithName = Block & { about: { name: string } };

export function applyBlockRefinements<Options extends object>(
	blocksAvailable: Block<object | undefined, Options>[],
	blocksInitial: Block<object | undefined, Options>[],
	options: Options,
	{ add = [], exclude = [] }: BlockRefinements<Options> = {},
) {
	const allOptions = new Set(
		Object.entries(options)
			.filter(([, value]) => !!value)
			.map(([key]) => key),
	);
	const allBlocksByName = new Map(
		blocksAvailable
			.filter((block): block is BlockWithName => !!block.about?.name)
			.map((block) => [block.about.name.toLowerCase(), block]),
	);
	const refinementsByBlock = new CachedFactory<string, BlockRefinement>(
		() => ({}),
	);
	let hadBlockRefinement = false;

	for (const optionKey of allOptions) {
		const matches = /^(add|exclude)-(.+)/.exec(optionKey.toLowerCase());
		if (!matches) {
			continue;
		}

		const [, action, blockName] = matches;
		if (!allBlocksByName.has(blockName)) {
			throw new Error(`Unknown Block refinement option: --${optionKey}`);
		}

		const refinements = refinementsByBlock.get(blockName);

		refinements[action as "add" | "exclude"] = true;

		if (refinements.add && refinements.exclude) {
			throw new Error(
				`Cannot both add and exclude the same block: --add-${blockName}, --exclude-${blockName}`,
			);
		}

		hadBlockRefinement = true;
	}

	if (!add.length && !exclude.length && !hadBlockRefinement) {
		return blocksInitial;
	}

	const blocksRefined = new Set(blocksInitial);

	for (const [blockName, blockRefinements] of refinementsByBlock.entries()) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const block = allBlocksByName.get(blockName)!;

		if (blockRefinements.add) {
			blocksRefined.add(block);
		} else {
			blocksRefined.delete(block);
		}
	}

	for (const added of add) {
		blocksRefined.add(added);
	}

	for (const excluded of exclude) {
		blocksRefined.delete(excluded);
	}

	return Array.from(blocksRefined);
}
