import * as prompts from "@clack/prompts";
import * as z from "zod";

import { isZodDefaultDef } from "../schemas/isZodDefaultDef.js";
import { PromptFriendlyZodDef } from "../schemas/types.js";
import { validateNumber, validatorFromSchema } from "./validators.js";

export async function promptForOptionSchema(
	key: string,
	schema: z.ZodTypeAny,
	description: string | undefined,
	defaultValue: unknown,
) {
	const def = schema._def as PromptFriendlyZodDef;
	if (isZodDefaultDef(def)) {
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

			case z.ZodFirstPartyTypeKind.ZodEnum: {
				const options = def.values.map((value) => ({ value }));
				const text = await prompts.select({
					initialValue: defaultValue as string,
					message,
					options,
				});

				return cancelOrParse(schema, text);
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

				return cancelOrParse(schema, text);
			}

			default: {
				const text = await prompts.text({
					message,
					placeholder: defaultValue as string,
					validate: validatorFromSchema(schema),
				});

				return cancelOrParse(schema, text);
			}
		}
	}

	return value;
}

function cancelOrParse(schema: z.ZodTypeAny, text: unknown) {
	return prompts.isCancel(text) ? text : (schema.parse(text) as unknown);
}
