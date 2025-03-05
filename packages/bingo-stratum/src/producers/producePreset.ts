import { AnyShape, InferredObject, ProduceTemplateSettings } from "bingo";

import { BlockCreation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { StratumRefinements } from "../types/refinements.js";
import { applyBlockRefinements } from "./applyBlockRefinements.js";
import { produceBlocks } from "./produceBlocks.js";

/**
 * Settings to run a Preset with {@link producePreset}.
 * @template OptionsShape Schemas of options defined by the Preset's Base.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#producetemplate}
 */
export interface ProducePresetSettings<OptionsShape extends AnyShape>
	extends ProduceTemplateSettings<
		OptionsShape,
		StratumRefinements<InferredObject<OptionsShape>>
	> {
	/**
	 * Any optional Stratum customizations.
	 * @see {@link https://create.bingo/engines/stratum/details/configurations#refinements}
	 */
	refinements?: StratumRefinements<InferredObject<OptionsShape>>;
}

/**
 * Produces the Blocks in a Preset, merging the results into a single creation.
 * @template OptionsShape Schemas of options defined by the Preset's Base.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#producetemplate}
 */
export function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		mode,
		offline,
		options,
		refinements = {},
	}: ProducePresetSettings<OptionsShape>,
): BlockCreation<InferredObject<OptionsShape>> {
	const blocks = applyBlockRefinements(preset.blocks, refinements.blocks);

	const creation = produceBlocks(blocks, {
		addons: refinements.addons,
		mode,
		offline,
		options,
	});

	return {
		addons: [],
		files: {},
		requests: [],
		scripts: [],
		suggestions: [],
		...creation,
	};
}
