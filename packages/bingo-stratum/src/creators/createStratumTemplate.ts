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
import { createBlockRefinementOption } from "../utils/createBlockRefinementOption.js";
import { slugifyName } from "../utils/slugifyName.js";
import { inferPreset } from "./inferPreset.js";

export function createStratumTemplate<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
): StratumTemplate<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	const namedBlocks = Array.from(
		new Set(
			templateDefinition.presets
				.flatMap((preset) => preset.blocks.map((block) => block.about?.name))
				.filter((blockName) => typeof blockName === "string"),
		),
	);

	const template: StratumTemplate<OptionsShape> = {
		...templateDefinition,
		base,
		blocks: Array.from(
			new Set([
				...(templateDefinition.blocks ?? []),
				...templateDefinition.presets.flatMap((preset) => preset.blocks),
			]),
		),
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
			// Block refinement options are not present in the types, because:
			// * It'd be a lot of types plumbing to know the full list of Blocks.
			// * We want to discourage using them in config files: it's better to
			//   instead use imported Blocks in `refinements.blocks`.
			//
			// TODO: It would be nice to have labeled groups of options.
			// https://github.com/JoshuaKGoldberg/bingo/issues/288
			...Object.fromEntries(
				namedBlocks
					.map(
						(blockName) =>
							[
								createBlockRefinementOption("add", blockName),
								z
									.boolean()
									.describe(`whether to add the ${blockName} block`)
									.optional(),
							] as const,
					)
					.sort(([a], [b]) => a.localeCompare(b)),
			),
			...Object.fromEntries(
				namedBlocks
					.map(
						(blockName) =>
							[
								createBlockRefinementOption("exclude", blockName),
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
			// TODO: Why are these type assertions necessary?
			// https://github.com/JoshuaKGoldberg/bingo/issues/287
			return {
				preset: () => {
					if (context.options.preset) {
						return context.options.preset as string;
					}

					// TODO: It would be better to run the base.prepare first to generate option defaults.
					// https://github.com/JoshuaKGoldberg/bingo/issues/289
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
			} as LazyOptionalOptions<Partial<Options>>;
		},
		produce(context) {
			return produceStratumTemplate(
				template,
				context as ProduceStratumTemplateSettings<OptionsShape>,
			);
		},
	};

	return template;
}
