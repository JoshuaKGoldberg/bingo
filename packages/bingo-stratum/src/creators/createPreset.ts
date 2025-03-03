import { AnyShape, InferredObject } from "bingo";

import { Base } from "../types/bases.js";
import { Preset, PresetDefinition } from "../types/presets.js";
import { assertNoDuplicateBlocks } from "./assertNoDuplicateBlocks.js";

export function createPreset<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
): Preset<OptionsShape> {
	assertNoDuplicateBlocks(presetDefinition);

	return {
		...presetDefinition,
		base,
	};
}
