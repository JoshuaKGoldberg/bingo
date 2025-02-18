import { applyMerger, mergeCreations } from "bingo";
import { withoutUndefinedProperties } from "without-undefined-properties";

import { BlockCreation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";

export function mergeBlockCreations<Options extends object>(
	first: Partial<BlockCreation<Options>>,
	second: Partial<BlockCreation<Options>>,
) {
	return withoutUndefinedProperties({
		...mergeCreations(first, second),
		addons: applyMerger(first.addons, second.addons, mergeAddons),
	});
}
