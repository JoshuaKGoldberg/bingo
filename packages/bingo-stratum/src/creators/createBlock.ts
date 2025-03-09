import { AnyOptionalShape, InferredObject } from "bingo";

import {
	BlockContextWithAddons,
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "../types/blocks.js";
import { applyZodDefaults, isDefinitionWithAddons } from "./utils.js";

export function createBlock<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
>(
	blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
): BlockWithAddons<InferredObject<AddonsShape>, Options>;
export function createBlock<Options extends object>(
	blockDefinition: BlockDefinitionWithoutAddons<Options>,
): BlockWithoutAddons<Options>;
export function createBlock<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
>(
	blockDefinition:
		| BlockDefinitionWithAddons<AddonsShape, Options>
		| BlockDefinitionWithoutAddons<Options>,
) {
	// Blocks without Addons can't be called as functions.
	if (!isDefinitionWithAddons(blockDefinition)) {
		return blockDefinition;
	}

	const addonsSchema = blockDefinition.addons;

	type Addons = InferredObject<AddonsShape>;

	// Blocks with Addons do need to be callable as functions...
	function block(addons: Addons) {
		return { addons, block };
	}

	// ...and also still have the Block Definition properties.
	Object.assign(block, blockDefinition);

	block.produce = (context: BlockContextWithAddons<Addons, Options>) => {
		return blockDefinition.produce({
			...context,
			addons: applyZodDefaults(addonsSchema, context.addons),
		});
	};

	return block as BlockWithAddons<Addons, Options>;
}
