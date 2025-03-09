import {
	AnyShape,
	InferredObject,
	Template,
	TemplateAbout,
	TemplatePrepare,
} from "bingo";
import { z } from "zod";

import { Base } from "./bases.js";
import { Preset } from "./presets.js";
import { StratumRefinements } from "./refinements.js";

/**
 * Stratum Template grouping together Presets of Blocks created from a Base.
 * @template OptionsShape Schemas of options the Base's Blocks takes in.
 * @see {@link https://www.create.bingo/engines/stratum/concepts/templates}
 */
export interface StratumTemplate<OptionsShape extends AnyShape>
	extends Template<
		OptionsShape & StratumTemplateOptionsShape,
		StratumRefinements<InferredObject<OptionsShape>>
	> {
	/**
	 * Base creating this Template, as well as its Blocks and Presets.
	 * @see {@link https://www.create.bingo/engines/stratum/concepts/bases}
	 */
	base: Base<OptionsShape>;

	/**
	 * Sets up lazily load default options values.
	 * This is indicated as required here because all Stratum Templates infer
	 * at least their --preset during transition mode.
	 * @see {@link https://www.create.bingo/build/apis/create-template#prepare}
	 */
	prepare: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;

	/**
	 * The Presets users can choose from with the Template, in order of how they should be listed.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createtemplate-presets}
	 */
	presets: Preset<OptionsShape>[];
}

/**
 * Description of how to create a Stratum Template from a Base.
 * @template OptionsShape Schemas of options the Base's Blocks takes in.
 */
export interface StratumTemplateDefinition<OptionsShape extends AnyShape> {
	/**
	 * About information for the template, including an optional repository locator.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createtemplate-about}
	 */
	about?: TemplateAbout;

	/**
	 * Sets up lazily load default options values.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createtemplate-prepare}
	 */
	prepare?: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;

	/**
	 * Presets users can choose from with the Template, in order of how they should be listed.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createtemplate-presets}
	 */
	presets: Preset<OptionsShape>[];

	/**
	 * Suggested Preset to select by default for users, if not the first in the array.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createtemplate-suggested}
	 */
	suggested?: Preset<OptionsShape>;
}

/**
 * The minimal options that are passed to all Stratum Blocks.
 */
export interface StratumTemplateOptions {
	/**
	 * Which Preset is being run.
	 */
	preset: string;
}

/**
 * The minimum options schemas all Stratum Templates share.
 */
export interface StratumTemplateOptionsShape {
	/**
	 * Union of Preset names available to choose from.
	 */
	preset: z.ZodDefault<z.ZodUnion<ZodPresetNameLiterals>>;
}

/**
 * Union of at least two literal Preset names available to choose from.
 */
export type ZodPresetNameLiterals = [
	z.ZodLiteral<string>,
	z.ZodLiteral<string>,
	...z.ZodLiteral<string>[],
];
