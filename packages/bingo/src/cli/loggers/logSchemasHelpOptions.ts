import { AnyShape } from "../../types/shapes.js";
import { getSchemaTypeName } from "../../utils/getSchemaTypeName.js";
import { logHelpOptions } from "./logHelpOptions.js";

export function logSchemasHelpOptions(packageName: string, schemas: AnyShape) {
	logHelpOptions(
		packageName,
		packageName,
		Object.entries(schemas)
			.map(([flag, schema]) => ({
				flag: `--${flag}`,
				text: asSentence(schema.description),
				type: getSchemaTypeName(schema),
			}))
			// TODO: Once a Zod-to-args conversion is made, reuse that here...
			// https://github.com/JoshuaKGoldberg/bingo/issues/285
			.filter((entry) => !entry.type.startsWith("object")),
	);
}

function asSentence(text: string | undefined) {
	return text && text[0].toUpperCase() + text.slice(1) + ".";
}
