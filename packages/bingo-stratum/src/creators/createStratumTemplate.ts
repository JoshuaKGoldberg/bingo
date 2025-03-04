import { AnyShape, InferredObject, LazyOptionalOptions } from "bingo";
import chalk from "chalk";
import { z } from "zod";

import { produceStratumTemplate } from "../producers/produceStratumTemplate.js";
import { Base } from "../types/bases.js";
import {
	StratumTemplate,
	StratumTemplateDefinition,
	ZodPresetNameLiterals,
} from "../types/templates.js";
import { slugifyPresetName } from "../utils.ts/slugifyPresetName.js";
import { inferPreset } from "./inferPreset.js";

export function createStratumTemplate<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
): StratumTemplate<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

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
		prepare(context) {
			return {
				preset: () => {
					// TODO: It would be better to run the base.prepare first to generate option defaults.
					// ...
					const preset =
						context.files && inferPreset(context, templateDefinition.presets);

					if (preset) {
						context.log(
							`Detected ${chalk.blue(`--preset ${preset}`)} from existing files on disk.`,
						);
					}

					return preset;
				},
				...(base.prepare?.(context) ?? {}),
			} as LazyOptionalOptions<Partial<Options>>; // TODO: Why is this type assertion necessary?
		},
		produce(context) {
			return produceStratumTemplate(template, context);
		},
	};

	return template;
}
