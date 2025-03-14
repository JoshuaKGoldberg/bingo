import {
	AnyShape,
	createSystemContextWithAuth,
	InferredObject,
	runCreation,
	RunTemplateSettings,
} from "bingo";

import { producePreset } from "../producers/producePreset.js";
import { BlockCreation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { StratumRefinements } from "../types/refinements.js";

export type RunPresetSettings<OptionsShape extends AnyShape> =
	RunTemplateSettings<
		OptionsShape,
		StratumRefinements<InferredObject<OptionsShape>>
	>;

/**
 * Generates and applies the Blocks in a Preset.
 * @template OptionsShape Schemas of options the Preset's Base takes in.
 * @see {@link https://www.create.bingo/engines/stratum/apis/runners#runTemplate}
 */
export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: RunPresetSettings<OptionsShape>,
): Promise<BlockCreation<InferredObject<OptionsShape>>> {
	const { directory = ".", offline } = settings;
	const system = await createSystemContextWithAuth({ directory, ...settings });

	const creation = producePreset(preset, settings);

	await runCreation(creation, { offline, system });

	return creation;
}
