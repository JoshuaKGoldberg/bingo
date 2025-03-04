// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable jsdoc/text-escaping -- https://github.com/gajus/eslint-plugin-jsdoc/issues/1360 */

import { z } from "zod";

/**
 * Any object containing Zod schemas that are optional.
 * In other words, allows providing an empty object {} value.
 */
export type AnyOptionalShape = Record<
	string,
	z.ZodDefault<z.ZodType> | z.ZodOptional<z.ZodType>
>;

/**
 * Any object containing Zod schemas as values.
 */
export type AnyShape = z.ZodRawShape;

/**
 * Given an object containing Zod schemas, produces the equivalent runtime type.
 * @example
 * ```ts
 * InferredObject<{ value: z.ZodNumber }>
 * ```
 * is the same as:
 * ```ts
 * { value: number }
 * ```
 */
export type InferredObject<OptionsShape extends AnyShape | undefined> =
	OptionsShape extends AnyShape
		? z.infer<z.ZodObject<OptionsShape>>
		: undefined;
