import { z } from "zod";

/**
 * The known Zod schema types that we know how to prompt for with Clack.
 */
export type PromptFriendlyZodDef =
	| z.ZodBooleanDef
	| z.ZodEnumDef
	| z.ZodLiteralDef
	| z.ZodNumberDef
	| z.ZodOptionalDef
	| z.ZodStringDef
	| z.ZodUnionDef
	| ZodDefaultDefWithType;

/**
 * Our view of default defs: we access the private innerType and typeName properties.
 */
export type ZodDefaultDefWithType = z.ZodDefaultDef & {
	innerType: z.ZodTypeAny;
	typeName: z.ZodFirstPartyTypeKind.ZodDefault;
};
