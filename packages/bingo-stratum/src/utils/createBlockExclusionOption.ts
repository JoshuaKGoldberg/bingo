import { slugifyName } from "./slugifyName.js";

export function createBlockExclusionOption(blockName: string) {
	return `exclude-${slugifyName(blockName)}`;
}
