import { AnyShape, InferredObject } from "../options.js";
import { Template } from "../types/templates.js";
import { CreatedConfig } from "./types.js";

export interface CreateConfigArgs<
	OptionsShape extends AnyShape = AnyShape,
	Settings extends object = object,
> {
	options?: InferredObject<OptionsShape>;
	settings?: Settings;
}

export function createConfig<
	OptionsShape extends AnyShape = AnyShape,
	Settings extends object = object,
>(
	template: Template<OptionsShape>,
	{ options, settings }: CreateConfigArgs<OptionsShape, Settings> = {},
): CreatedConfig<OptionsShape> {
	return { options, settings, template };
}
