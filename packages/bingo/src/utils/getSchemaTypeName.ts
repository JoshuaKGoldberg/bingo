// TODO: Split Zod generation out into standalone package
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */

import { z } from "zod";

export function getSchemaTypeName(schema: z.ZodTypeAny): string {
	const schemaInner = getSchemaInner(schema);

	if (schemaInner._def.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
		return `${getSchemaTypeName(schemaInner._def.type)}[]`;
	}

	if (schemaInner._def.typeName === z.ZodFirstPartyTypeKind.ZodLiteral) {
		return JSON.stringify((schemaInner._def as z.ZodLiteralDef).value);
	}

	if (schemaInner._def.typeName === z.ZodFirstPartyTypeKind.ZodUnion) {
		return (
			(schemaInner._def as z.ZodUnionDef).options
				.map((constituent) => getSchemaTypeName(constituent))
				// TODO: Once these can be parsed as args, reuse that here...
				.filter((typeName) => typeName !== "object")
				.join(" | ")
		);
	}

	// n.b. it's not necessary an object, that's just one of many with a typeName
	return (schemaInner._def as z.ZodObjectDef).typeName
		.replace("Zod", "")
		.toLowerCase();
}

function getSchemaInner(schema: z.ZodTypeAny): z.ZodTypeAny {
	if (schema.isOptional()) {
		return getSchemaInner((schema._def as z.ZodOptionalDef).innerType);
	}

	if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
		return getSchemaInner((schema._def as z.ZodEffectsDef).schema);
	}

	return schema;
}
