import { AnyShape } from "bingo";
import { z } from "zod";

import { produceStratumTemplate } from "../producers/produceStratumTemplate.js";
import { Base } from "../types/bases.js";
import {
	StratumTemplate,
	StratumTemplateDefinition,
	ZodPresetNameLiterals,
} from "../types/templates.js";
import { slugifyPresetName } from "../utils.ts/slugifyPresetName.js";

export function createStratumTemplate<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
): StratumTemplate<OptionsShape> {
	const presetOption = z
		.union(
			templateDefinition.presets.map((preset) =>
				z.literal(slugifyPresetName(preset.about.name)),
			) as ZodPresetNameLiterals,
		)
		.describe("starting set of tooling to use");
	const template: StratumTemplate<OptionsShape> = {
		...templateDefinition,
		base,
		options: {
			...base.options,
			preset: presetOption.default(
				slugifyPresetName(
					(templateDefinition.suggested ?? templateDefinition.presets[0]).about
						.name,
				),
			) as unknown as z.ZodUnion<ZodPresetNameLiterals>, // TODO: why don't the types allow a ZodDefault here?
		},
		prepare: base.prepare,
		produce(context) {
			return produceStratumTemplate(template, context);
		},
	};

	return template;
}
