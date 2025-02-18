import { ProductionMode } from "bingo";

import { mergeBlockCreations } from "../mergers/mergeBlockCreations.js";
import { Block, BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";
import {
	BlockProduction,
	getUpdatedBlockAddons,
} from "./getUpdatedBlockAddons.js";
import { produceBlock } from "./produceBlock.js";

export interface ProduceBlocksSettings<Options extends object> {
	addons?: CreatedBlockAddons<object, Options>[];
	mode?: ProductionMode;
	offline?: boolean;
	options: Options;
}

export function produceBlocks<Options extends object>(
	blocks: Block<object | undefined, Options>[],
	{ addons, mode, offline, options }: ProduceBlocksSettings<Options>,
) {
	// From Templating Engines > Stratum > Details > Execution:
	// This engine continuously re-runs Blocks until no new Addons are provided.

	const blockProductions = new Map<
		Block<object | undefined, Options>,
		BlockProduction<object>
	>(addons?.map((addon) => [addon.block, { addons: addon.addons }]));

	// 1. Create a queue of Blocks to be run, starting with all defined in the Preset
	const allowedBlocks = new Set(blocks);
	const blocksToBeRun = new Set(blocks);

	// 2. For each Block in the queue:
	while (blocksToBeRun.size) {
		for (const currentBlock of blocksToBeRun) {
			blocksToBeRun.delete(currentBlock);

			// 2.1. Get the Creation from the Block, passing any current known Addons
			// 2.2. If a mode is specified, additionally generate the appropriate Block Creations
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

			// 2.3. Store that Block's Creation
			blockProductions.set(currentBlock, {
				addons: previousAddons,
				creation: blockCreation,
			});

			// 2.4. If the Block specified new addons for any defined Blocks:
			const updatedBlockAddons = getUpdatedBlockAddons(
				allowedBlocks,
				blockProductions,
				blockCreation.addons,
			);

			// 2.4.1: Add those Blocks to the queue to re-run
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

	// 3. Merge all Block Creations together
	return (
		Array.from(blockProductions.values()) as BlockProduction<Options>[]
	).reduce(
		(created, next) => mergeBlockCreations(created, next.creation ?? {}),
		{},
	);
}
