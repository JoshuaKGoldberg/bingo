import { slugifyName } from "./slugifyName.js";

export function createBlockRefinementOption(prefix: string, blockName: string) {
	return `${prefix}-${slugifyName(blockName)}`;
}
