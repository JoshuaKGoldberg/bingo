import * as fs from "node:fs";
import { z } from "zod";

export function validateNewDirectory(value: string) {
	if (value && fs.existsSync(value)) {
		return `That directory already exists. Please choose another one.`;
	}

	return validateText(value);
}

export function validateNumber(value: string) {
	if (isNaN(parseFloat(value))) {
		return "Please enter a numeric value.";
	}
}

export function validatorFromSchema(schema: z.ZodTypeAny) {
	return (value: string) => {
		return (
			schema.safeParse(value).error?.errors[0].message ?? validateText(value)
		);
	};
}

function validateText(value: string) {
	if (!value) {
		return "Please enter a value.";
	}
}
