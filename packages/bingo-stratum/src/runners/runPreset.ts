import {
	AnyShape,
	createSystemContextWithAuth,
	InferredObject,
	runCreation,
	RunTemplateSettings,
} from "bingo";
import { IntakeDirectory } from "bingo-fs";

import { producePreset } from "../producers/producePreset.js";
import { BlockCreation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { StratumRefinements } from "../types/refinements.js";

export interface RunPresetSettings<OptionsShape extends AnyShape>
	extends RunTemplateSettings<
		OptionsShape,
		StratumRefinements<InferredObject<OptionsShape>>
	> {
	/**
	 * Existing file creations to be used for Blocks that can intake Addons.
	 */
	files?: IntakeDirectory;
}

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
