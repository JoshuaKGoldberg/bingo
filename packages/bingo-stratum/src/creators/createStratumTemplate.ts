import { AnyShape, InferredObject, LazyOptionalOptions } from "bingo";
import chalk from "chalk";
import { z } from "zod";

import {
	produceStratumTemplate,
	ProduceStratumTemplateSettings,
} from "../producers/produceStratumTemplate.js";
import { Base } from "../types/bases.js";
import {
	StratumTemplate,
	StratumTemplateDefinition,
	ZodPresetNameLiterals,
} from "../types/templates.js";
import { createBlockExclusionOption } from "../utils/createBlockExclusionOption.js";
import { slugifyName } from "../utils/slugifyName.js";
import { inferPreset } from "./inferPreset.js";

export function createStratumTemplate<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
): StratumTemplate<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	const template: StratumTemplate<OptionsShape> = {
		...templateDefinition,
		base,
		createConfig: (config) => ({ ...config, template }),
		options: {
			...base.options,
			preset: z
				.union(
					templateDefinition.presets.map((preset) =>
						z.literal(slugifyName(preset.about.name)),
					) as ZodPresetNameLiterals,
				)
				.describe("starting set of tooling to use")
				.default(
					slugifyName(
						(templateDefinition.suggested ?? templateDefinition.presets[0])
							.about.name,
					),
				),
			// Exclusion options are not present in the types, because:
			// * It'd be a lot of types plumbing to know the full list of Blocks.
			// * We want to discourage using them in config files: it's better to
			//   instead use imported Blocks in `refinements.blocks.exclude`.
			//
			// TODO: It would be nice to have labeled groups of options.
			// That way these don't get logged alongside the more normal options...
			...Object.fromEntries(
				Array.from(
					new Set(
						templateDefinition.presets.flatMap((preset) =>
							preset.blocks.map((block) => block.about?.name),
						),
					),
				)
					.filter((blockName) => typeof blockName === "string")
					.map(
						(blockName) =>
							[
								createBlockExclusionOption(blockName),
								z
									.boolean()
									.describe(`whether to exclude the ${blockName} block`)
									.optional(),
							] as const,
					)
					.sort(([a], [b]) => a.localeCompare(b)),
			),
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
			return produceStratumTemplate(
				template,
				// TODO: Why is this type assertion necessary?
				context as ProduceStratumTemplateSettings<OptionsShape>,
			);
		},
	};

	return template;
}
