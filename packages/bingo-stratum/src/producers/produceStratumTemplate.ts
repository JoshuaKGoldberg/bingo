import { AnyShape, InferredObject, ProductionMode } from "bingo";

import { CreatedBlockAddons } from "../types/creations.js";
import { BlockModifications } from "../types/settings.js";
import { StratumTemplate } from "../types/templates.js";
import { getPresetByName } from "../utils.ts/getPresetByName.js";
import { applyBlockModifications } from "./applyBlockModifications.js";
import { produceBlocks } from "./produceBlocks.js";

export interface ProduceStratumTemplateSettings<OptionsShape extends AnyShape> {
	// TODO: Get this to work with object or never...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	mode?: ProductionMode;
	offline?: boolean;
	options: InferredObject<OptionsShape> & { preset: string };
}

export function produceStratumTemplate<
	OptionsShape extends AnyShape = AnyShape,
>(
	template: StratumTemplate<OptionsShape>,
	{
		addons,
		blocks: blockModifications,
		mode,
		offline,
		options,
	}: ProduceStratumTemplateSettings<OptionsShape>,
) {
	const preset = getPresetByName(template.presets, options.preset);
	if (preset instanceof Error) {
		throw preset;
	}

	const blocks = applyBlockModifications(preset.blocks, blockModifications);

	return produceBlocks(blocks, {
		addons,
		mode,
		offline,
		options,
	});
}
