import { TemplateConfig } from "../types/configs.js";
import { AnyShape } from "../types/shapes.js";
import { isTemplate } from "./isTemplate.js";

export function isTemplateConfig(
	value: unknown,
): value is TemplateConfig<AnyShape, unknown> {
	return (
		!!value &&
		typeof value === "object" &&
		"template" in value &&
		isTemplate(value.template)
	);
}
