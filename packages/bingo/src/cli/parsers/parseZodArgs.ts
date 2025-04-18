// TODO: Split out into standalone package
// https://github.com/bingo-js/bingo/issues/285
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { parseArgs, ParseArgsConfig } from "node:util";
import {
	ZodBooleanDef,
	ZodFirstPartyTypeKind,
	ZodLiteralDef,
	ZodStringDef,
	ZodTypeAny,
} from "zod";

import { AnyShape, InferredObject } from "../../types/shapes.js";

// TODO: Send issue/PR to DefinitelyTyped to export these from node:util...
// https://github.com/bingo-js/bingo/issues/284

type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;

type ParseArgsOptionsType = ParseArgsOptionsConfig[string]["type"];

export function parseZodArgs<OptionsShape extends AnyShape>(
	args: string[],
	options: OptionsShape,
): InferredObject<OptionsShape> {
	const argsOptions: ParseArgsConfig["options"] = {};

	for (const [key, value] of Object.entries(options)) {
		const argsOption = zodValueToArgsOption(key, value);

		if (!(argsOption instanceof Error)) {
			argsOptions[key] = argsOption;
		}
	}

	return parseArgs({
		args,
		options: argsOptions,
		strict: false,
	}).values as InferredObject<OptionsShape>;
}

function zodValueToArgsOption(
	key: string,
	zodValue: ZodTypeAny,
): Error | ParseArgsOptionsConfig[string] {
	switch (zodValue._def.typeName) {
		case "ZodBoolean":
		case "ZodLiteral":
		case "ZodString":
			return {
				type: zodValueTypeToArgsOptionType(zodValue._def),
			};

		case "ZodDefault":
		case "ZodOptional":
			return zodValueToArgsOption(key, zodValue._def.innerType);

		case "ZodUnion":
			return zodValueToArgsOption(key, zodValue._def.options[0]);
	}

	return new Error(
		`create does not know how to parse --${key}'s Zod type on the CLI: ${zodValue._def.typeName as string}`,
	);
}

function zodValueTypeToArgsOptionType(
	def: ZodBooleanDef | ZodLiteralDef | ZodStringDef,
): ParseArgsOptionsType {
	switch (def.typeName) {
		case ZodFirstPartyTypeKind.ZodBoolean:
			return "boolean";

		case ZodFirstPartyTypeKind.ZodLiteral: {
			const typeofValue = typeof def.value;
			if (typeofValue === "boolean" || typeofValue === "string") {
				return typeofValue;
			}
			throw new Error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call
				`create does not know how to parse this Zod literal on the CLI: ${def.value?.toString()}`,
			);
		}

		case ZodFirstPartyTypeKind.ZodString:
			return "string";
	}
}
