import * as prompts from "@clack/prompts";
import * as z from "zod";

import { validateNumber, validatorFromSchema } from "./validators.js";

type ZodDef = z.ZodBooleanDef | z.ZodNumberDef | z.ZodStringDef;

export async function promptForSchema(
	key: string,
	schema: z.ZodTypeAny,
	defaultValue: unknown,
) {
	const def = schema._def as ZodDef;
	const message = schema.description
		? `What will the ${schema.description} be? (--${key})`
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

			// TODO: Handle numeric literals, unions, ...

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
