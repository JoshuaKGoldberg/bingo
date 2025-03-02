import * as prompts from "@clack/prompts";
import * as z from "zod";

import { validateNumber, validatorFromSchema } from "./validators.js";

type ZodDef =
	| z.ZodBooleanDef
	| (z.ZodDefault<z.ZodTypeAny> & {
			innerType: z.ZodTypeAny;
			typeName: z.ZodFirstPartyTypeKind.ZodDefault;
	  })
	| z.ZodUnionDef
	| ZodStringLikeDef;

type ZodStringLikeDef = z.ZodNumberDef | z.ZodStringDef;

export async function promptForOptionSchema(
	key: string,
	schema: z.ZodTypeAny,
	description: string | undefined,
	defaultValue: unknown,
) {
	const def = schema._def as ZodDef;
	if (def.typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
		return await promptForOptionSchema(
			key,
			def.innerType,
			def.innerType.description,
			defaultValue,
		);
	}
	const message = description
		? `What will the ${description} be? (--${key})`
		: `What will the --${key} be?`;
	let value: unknown;

	while (value === undefined || value === "") {
		switch (def.typeName) {
			case z.ZodFirstPartyTypeKind.ZodBoolean: {
				value = await prompts.confirm({
					initialValue: defaultValue as boolean,
					message,
				});
				break;
			}

			case z.ZodFirstPartyTypeKind.ZodNumber:
				value = Number(
					await prompts.text({
						message,
						placeholder: defaultValue as string,
						validate: validateNumber,
					}),
				);
				break;

			case z.ZodFirstPartyTypeKind.ZodUnion: {
				const options = def.options.map((option) => ({
					// TODO: Handle non-string-like schema data types
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					value: `${(option._def as { value: number | string }).value}`,
				}));
				const text = await prompts.select({
					initialValue: defaultValue as string,
					message,
					options,
				});

				if (prompts.isCancel(text)) {
					return text;
				}

				return schema.parse(text) as unknown;
			}

			default: {
				const text = await prompts.text({
					message,
					placeholder: defaultValue as string,
					validate: validatorFromSchema(schema),
				});

				if (prompts.isCancel(text)) {
					return text;
				}

				return schema.parse(text) as unknown;
			}
		}
	}

	return value;
}
