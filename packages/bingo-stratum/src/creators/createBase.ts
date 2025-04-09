import { AnyShape } from "bingo";

import { Base, BaseDefinition } from "../types/bases.js";
import { assertNoPresetOption } from "./assertNoPresetOption.js";
import { createBlock } from "./createBlock.js";
import { createPreset } from "./createPreset.js";
import { createStratumTemplate } from "./createStratumTemplate.js";

/**
 * Creates a Stratum {@link Base}.
 * @template OptionsShape Schemas of options the Base's Blocks take in.
 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base}
 */
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
