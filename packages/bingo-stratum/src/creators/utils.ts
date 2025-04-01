import { AnyOptionalShape, InferredObject } from "bingo";
import { z } from "zod";

import { Block } from "../types/blocks.js";

export function applyZodDefaults<Shape extends AnyOptionalShape>(
	shape: Shape,
	value: InferredObject<Shape> | undefined,
): InferredObject<Shape> {
	return z.object(shape).parse(value ?? {}) as InferredObject<Shape>;
}

export function isBlockWithName<
	Addons extends object | undefined,
	Options extends object,
>(
	block: Block<Addons, Options>,
): block is Block<Addons, Options> & { about: { name: string } } {
	return !!block.about?.name;
}

export function isDefinitionWithAddons(definition: object) {
	return "addons" in definition;
}
