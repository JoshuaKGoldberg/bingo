import { AnyShape, InferredObject } from "../types/shapes.js";
import { Template } from "../types/templates.js";
import { isTemplate } from "./isTemplate.js";

export interface CreatedConfig<
	OptionsShape extends AnyShape = AnyShape,
	Settings extends object = object,
> {
	options?: InferredObject<OptionsShape>;
	settings?: Settings;
	template: Template<OptionsShape>;
}

export function isCreatedConfig(value: unknown): value is CreatedConfig {
	return (
		!!value &&
		typeof value === "object" &&
		"template" in value &&
		isTemplate(value.template)
	);
}
