import { z } from "zod";

import { PromptFriendlyZodDef } from "./types.js";

export function isStringLikeSchema(schema: z.ZodTypeAny): boolean {
	const def = schema._def as PromptFriendlyZodDef;

	switch (def.typeName) {
		case z.ZodFirstPartyTypeKind.ZodBoolean:
		case z.ZodFirstPartyTypeKind.ZodEnum:
		case z.ZodFirstPartyTypeKind.ZodLiteral:
		case z.ZodFirstPartyTypeKind.ZodNumber:
		case z.ZodFirstPartyTypeKind.ZodString:
			return true;

		case z.ZodFirstPartyTypeKind.ZodDefault:
		case z.ZodFirstPartyTypeKind.ZodOptional:
			return isStringLikeSchema(def.innerType);

		case z.ZodFirstPartyTypeKind.ZodUnion:
			return def.options.every((option) => isStringLikeSchema(option));

		default:
			return false;
	}
}
