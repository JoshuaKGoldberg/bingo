// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

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
