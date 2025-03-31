import { ProductionMode } from "bingo";
import { IntakeDirectory } from "bingo-fs";

import { mergeBlockCreations } from "../mergers/mergeBlockCreations.js";
import { Block, BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";
import {
	BlockProduction,
	getUpdatedBlockAddons,
} from "./getUpdatedBlockAddons.js";
import { produceBlock } from "./produceBlock.js";

export interface ProduceBlocksSettings<Options extends object> {
	blockAddons?: CreatedBlockAddons<object, Options>[];
	files?: IntakeDirectory;
	mode?: ProductionMode;
	offline?: boolean;
	options: Options;
}

export function produceBlocks<Options extends object>(
	blocks: Block<object | undefined, Options>[],
	{
		blockAddons,
		files = {},
		mode,
		offline,
		options,
	}: ProduceBlocksSettings<Options>,
) {
	// From Templating Engines > Stratum > Details > Execution:
	// This engine continuously re-runs Blocks until no new Addons are provided.

	// Collect all Blocks defined in the Preset, along with their Addons:
	const blockProductions = new Map<
		Block<object | undefined, Options>,
		BlockProduction<object>
	>();

	// 1.1. Run any intake methods to generate default Addons values
	for (const block of blocks) {
		if (isBlockWithAddons(block) && block.intake) {
			blockProductions.set(block, {
				addons: block.intake({ files }),
			});
		}
	}
	// 2.2. Apply all provided refinements on top of those
	for (const { addons, block } of blockAddons ?? []) {
		blockProductions.set(block, {
			addons: {
				...blockProductions.get(block)?.addons,
				...addons,
			},
		});
	}

	// 2. Create a queue of Blocks to be run, starting with all defined in the Preset
	const allowedBlocks = new Set(blocks);
	const blocksToBeRun = new Set(blocks);

	// 3. For each Block in the queue:
	while (blocksToBeRun.size) {
		for (const currentBlock of blocksToBeRun) {
			blocksToBeRun.delete(currentBlock);

			// 3.1. Get the Creation from the Block, passing any current known Addons
			// 3.2. If a mode is specified, additionally generate the appropriate Block Creations
			const previousProduction = blockProductions.get(currentBlock);
			const previousAddons = previousProduction?.addons ?? {};
			const blockCreation = produceBlock(
				currentBlock as BlockWithAddons<object, Options>,
				{
					addons: previousAddons,
					mode,
					offline,
					options,
				},
			);

			// 3.3. Store that Block's Creation
			blockProductions.set(currentBlock, {
				addons: previousAddons,
				creation: blockCreation,
			});

			// 3.4. If the Block specified new addons for any defined Blocks:
			const updatedBlockAddons = getUpdatedBlockAddons(
				allowedBlocks,
				blockProductions,
				blockCreation.addons,
			);

			// 3.4.1: Add those Blocks to the queue to re-run
			for (const [updatedBlock, updatedAddons] of updatedBlockAddons) {
				const addedBlockPreviousProduction = blockProductions.get(updatedBlock);
				blockProductions.set(updatedBlock, {
					...addedBlockPreviousProduction,
					addons: updatedAddons,
				});
				blocksToBeRun.add(updatedBlock);
			}
		}
	}

	// 4. Merge all Block Creations together
	return (
		Array.from(blockProductions.values()) as BlockProduction<Options>[]
	).reduce(
		(created, next) => mergeBlockCreations(created, next.creation ?? {}),
		{},
	);
}

function isBlockWithAddons<Options extends object>(
	block: Block<object | undefined, Options>,
): block is BlockWithAddons<object, Options> {
	return !!("addons" in block);
}
