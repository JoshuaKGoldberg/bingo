import { AnyShape } from "bingo";

import { Base, BaseDefinition } from "../types/bases.js";
import { assertNoPresetOption } from "./assertNoPresetOption.js";
import { createBlock } from "./createBlock.js";
import { createPreset } from "./createPreset.js";
import { createStratumTemplate } from "./createStratumTemplate.js";

export function createBase<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
): Base<OptionsShape> {
	assertNoPresetOption(baseDefinition);

	const base: Base<OptionsShape> = {
		...baseDefinition,
		createBlock,
		createPreset: (presetDefinition) => createPreset(base, presetDefinition),
		createStratumTemplate: (templateDefinition) =>
			createStratumTemplate(base, templateDefinition),
	};

	return base;
}

// TODO: I had just extracted createBlock, createPreset, and createStratumTemplate
// into their own functions. Not any pressing reason, I just keep getting confused
// searching them by name then remembering from the 0 results to look at this file.
// Next up is the actual issue at play, #215: generate --exclude-* options in templates.
// I'll have to auto-generate options to createStratumTemplate.
// So far the only auto-generated option is preset: z.string()...
