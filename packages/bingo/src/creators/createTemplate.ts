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
export function createTemplate<OptionsShape extends AnyShape>(
	definition: TemplateDefinition<OptionsShape>,
): Template<OptionsShape>;
export function createTemplate(
	definition: TemplateDefinition<{}>,
): Template<{}>;
export function createTemplate<OptionsShape extends AnyShape>(
	definition: TemplateDefinition<OptionsShape>,
): Template<OptionsShape> {
	return {
		options: {} as OptionsShape,
		...definition,
	};
}
