import { AnyOptionalShape, InferredObject } from "bingo";
import { z } from "zod";

export function applyZodDefaults<Shape extends AnyOptionalShape>(
	shape: Shape,
	value: InferredObject<Shape> | undefined,
): InferredObject<Shape> {
	return z.object(shape).parse(value ?? {}) as InferredObject<Shape>;
}

export function isDefinitionWithAddons(definition: object) {
	return "addons" in definition;
}
