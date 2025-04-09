import { AnyShape } from "../types/shapes.js";
import { Template } from "../types/templates.js";

export function isTemplate(
	value: unknown,
): value is Template<AnyShape, unknown> {
	return (
		!!value &&
		typeof value === "object" &&
		"options" in value &&
		!!value.options &&
		typeof value.options === "object" &&
		"produce" in value &&
		typeof value.produce === "function"
	);
}
