import { AnyShape } from "bingo";
import { z } from "zod";

import { hasName } from "../predicates/hasName.js";
import { produceStratumTemplate } from "../producers/produceStratumTemplate.js";
import { Base } from "../types/bases.js";
import {
	StratumTemplate,
	StratumTemplateDefinition,
} from "../types/templates.js";

export function createStratumTemplate<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
): StratumTemplate<OptionsShape> {
	const exclusionOptions = templateDefinition.presets
		.flatMap((preset) => preset.blocks)
		.filter(hasName)
		.map(
			(block) =>
				[
					`exclude${block.about.name.replaceAll(/\W/g, "")}`,
					z
						.boolean()
						.describe(`Whether to exclude the ${block.about.name} block.`),
				] as const,
		);

	const template: StratumTemplate<OptionsShape> = {
		...templateDefinition,
		base,
		options: {
			...base.options,
			...Object.fromEntries(exclusionOptions),
			preset: z.string().describe("Which starting set of tooling to use."),
		},
		produce(context) {
			return produceStratumTemplate(template, context);
		},
	};

	return template;
}
