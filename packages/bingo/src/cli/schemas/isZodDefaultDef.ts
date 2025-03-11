// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { ZodDefaultDefWithType } from "./types.js";

export function isZodDefaultDef(def: any): def is ZodDefaultDefWithType {
	return def.typeName === z.ZodFirstPartyTypeKind.ZodDefault;
}
