import { AnyShape } from "../../options.js";
import { getSchemaTypeName } from "../../utils/getSchemaTypeName.js";
import { logHelpOptions } from "./logHelpOptions.js";

export function logSchemasHelpOptions(from: string, schemas: AnyShape) {
	logHelpOptions(
		from,
		Object.entries(schemas)
			.map(([flag, schema]) => ({
				flag,
				text: asSentence(schema.description),
				type: getSchemaTypeName(schema),
			}))
			// TODO: Once a Zod-to-args conversion is made, reuse that here...
			.filter((entry) => !entry.type.startsWith("object")),
	);
}

function asSentence(text: string | undefined) {
	return text && text[0].toUpperCase() + text.slice(1) + ".";
}
