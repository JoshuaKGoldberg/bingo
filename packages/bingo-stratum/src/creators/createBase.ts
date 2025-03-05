import { AnyOptionalShape, AnyShape, InferredObject } from "bingo";

import { Base, BaseDefinition } from "../types/bases.js";
import {
	BlockContextWithAddons,
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "../types/blocks.js";
import { assertNoPresetOption } from "./assertNoPresetOption.js";
import { createPreset } from "./createPreset.js";
import { createStratumTemplate } from "./createStratumTemplate.js";
import { applyZodDefaults, isDefinitionWithAddons } from "./utils.js";

/**
 * Creates a Stratum {@link Base}.
 * @template OptionsShape Schemas of options the Base's Blocks take in.
 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base}
 */
export function createBase<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
): Base<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	assertNoPresetOption(baseDefinition);

	function createBlock<AddonsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
	): BlockWithAddons<InferredObject<AddonsShape>, Options>;
	function createBlock(
		blockDefinition: BlockDefinitionWithoutAddons<Options>,
	): BlockWithoutAddons<Options>;
	function createBlock<AddonsShape extends AnyOptionalShape>(
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

	const base: Base<OptionsShape> = {
		...baseDefinition,
		createBlock,
		createPreset: (presetDefinition) => createPreset(base, presetDefinition),
		createStratumTemplate: (templateDefinition) =>
			createStratumTemplate(base, templateDefinition),
	};

	return base;
}
