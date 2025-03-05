import { BingoSystem } from "bingo-systems";

import { createSystemContext } from "../contexts/createSystemContext.js";
import { mergeCreations } from "../mergers/mergeCreations.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { AnyShape, InferredObject } from "../types/shapes.js";
import { Template } from "../types/templates.js";

/**
 * Settings to run a template with {@link produceTemplate}.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/produce-template#settings}
 */
export interface ProduceTemplateSettings<
	OptionsShape extends AnyShape,
	Refinements,
> extends Partial<BingoSystem> {
	/**
	 * Which repository mode Bingo is being run in.
	 * @see {@link https://create.bingo/build/concepts/modes}
	 */
	mode?: ProductionMode;

	/**
	 * Whether to run in an "offline" mode that skips network requests.
	 */
	offline?: boolean;

	/**
	 * Options values as described by the template's options schema.
	 */
	options: InferredObject<OptionsShape>;

	/**
	 * Any optional template-specific customizations.
	 */
	refinements?: Refinements;
}

/**
 * Runs a Template's produce(), along with a mode-specific producer if specified.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link http://create.bingo/build/apis/produce-template}
 */
export async function produceTemplate<
	OptionsShape extends AnyShape,
	Refinements,
>(
	template: Template<OptionsShape, Refinements>,
	settings: ProduceTemplateSettings<OptionsShape, Refinements>,
): Promise<Partial<Creation>> {
	const system = createSystemContext({
		directory: ".",
		...settings,
	});

	const context = { ...settings, ...system };
	let creation = await template.produce(context);

	const augmenter = settings.mode && template[settings.mode];
	if (augmenter) {
		creation = mergeCreations(creation, await augmenter(context));
	}

	return creation;
}
