import { Creation } from "bingo";

import { mergeAddonsIfUpdated } from "../mergers/mergeAddonsIfUpdated.js";
import { Block, BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";

export interface BlockProduction<Addons extends object | undefined> {
	addons: Addons;
	creation?: Partial<Creation>;
}

export function getUpdatedBlockAddons<Options extends object>(
	allowedBlocks: Set<Block<object | undefined, Options>>,
	blockProductions: Map<
		Block<object | undefined, Options>,
		BlockProduction<object>
	>,
	newBlockAddons: CreatedBlockAddons<object, Options>[] = [],
) {
	const updated: [BlockWithAddons<object, Options>, object][] = [];

	for (const newAddons of newBlockAddons) {
		if (!allowedBlocks.has(newAddons.block)) {
			continue;
		}

		const existingProduction = blockProductions.get(newAddons.block);
		if (!existingProduction) {
			updated.push([newAddons.block, newAddons.addons]);
			continue;
		}

		const updatedAddons = mergeAddonsIfUpdated(
			existingProduction.addons,
			newAddons.addons,
		);
		if (updatedAddons) {
			updated.push([newAddons.block, updatedAddons]);
		}
	}

	return updated;
}
