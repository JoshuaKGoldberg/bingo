import { z } from "zod";

export function getSchemaDefaultValue(schema: z.ZodTypeAny) {
	return (schema._def as Partial<z.ZodDefaultDef>).defaultValue?.() as unknown;
}
