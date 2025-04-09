import { AnyShape, InferredObject } from "./shapes.js";
import { Template } from "./templates.js";

/**
 * Configuration object to be default-exported from a config file.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/configuration}
 */
export interface TemplateConfig<OptionsShape extends AnyShape, Refinements> {
	/**
	 * Any overrides for options values as described by the template's options schema.
	 */
	options?: Partial<InferredObject<OptionsShape>>;

	/**
	 * Any optional customizations from a template-specific config file.
	 */
	refinements?: Refinements;

	/**
	 * The base template associated with this configuration.
	 */
	template: Template<OptionsShape, Refinements>;
}

/**
 * Settings to pass to a `createConfig()` function.
 * @template Options Options values as described by the template's options schema.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/configuration#createconfig}
 */
export interface TemplateCreateConfigSettings<
	Options extends object,
	Refinements,
> {
	options?: Partial<Options>;
	refinements?: Refinements;
}

/**
 * Creates a configuration object to be default-exported from a config file.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/configuration#createconfig}
 */
export type CreateTemplateConfig<OptionsShape extends AnyShape, Refinements> = (
	settings?: TemplateCreateConfigSettings<
		InferredObject<OptionsShape>,
		Refinements
	>,
) => TemplateConfig<OptionsShape, Refinements>;
