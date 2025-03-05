import { AnyShape, InferredObject, ProductionMode } from "bingo";

import { StratumRefinements } from "../types/refinements.js";
import { StratumTemplate } from "../types/templates.js";
import { getPresetByName } from "../utils/getPresetByName.js";
import { applyBlockRefinements } from "./applyBlockRefinements.js";
import { produceBlocks } from "./produceBlocks.js";

export interface ProduceStratumTemplateSettings<OptionsShape extends AnyShape> {
	mode?: ProductionMode;
	offline?: boolean;
	options: InferredObject<OptionsShape> & { preset: string };
	refinements?: StratumRefinements<InferredObject<OptionsShape>>;
}

export function produceStratumTemplate<
	OptionsShape extends AnyShape = AnyShape,
>(
	template: StratumTemplate<OptionsShape>,
	{
		mode,
		offline,
		options,
		refinements = {},
	}: ProduceStratumTemplateSettings<OptionsShape>,
) {
	const preset = getPresetByName(template.presets, options.preset);
	if (preset instanceof Error) {
		throw preset;
	}

	const blocks = applyBlockRefinements(
		preset.blocks,
		options,
		refinements.blocks,
	);

	return produceBlocks(blocks, {
		addons: refinements.addons,
		mode,
		offline,
		options,
	});
}
