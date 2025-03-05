// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AnyShape } from "../types/shapes.js";
import { Template, TemplateDefinition } from "../types/templates.js";

/**
 * Definition for creating a new Template.
 * @see {@link Template}
 * @see {@link TemplateDefinition}
 * @see {@link https://create.bingo/build/apis/create-template}
 */
export function createTemplate<OptionsShape extends AnyShape, Refinements>(
	definition: TemplateDefinition<OptionsShape, Refinements>,
): Template<OptionsShape, Refinements>;
export function createTemplate<Customizations>(
	definition: TemplateDefinition<{}, Customizations>,
): Template<{}, Customizations>;
export function createTemplate<OptionsShape extends AnyShape, Refinements>(
	definition: TemplateDefinition<OptionsShape, Refinements>,
): Template<OptionsShape, Refinements> {
	const template: Template<OptionsShape, Refinements> = {
		createConfig: (config) => ({ ...config, template }),
		options: {} as OptionsShape,
		...definition,
	};

	return template;
}
