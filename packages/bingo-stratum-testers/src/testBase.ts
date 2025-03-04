import {
	AnyShape,
	awaitLazyProperties,
	ContextLog,
	InferredObject,
	TakeInput,
} from "bingo";
import { Base } from "bingo-stratum";

import { createFailingFunction, createFailingObject } from "./utils.js";

export interface BaseContextSettings<OptionsShape extends AnyShape> {
	log?: ContextLog;
	options?: InferredObject<OptionsShape>;
	take?: TakeInput;
}

export async function testBase<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	settings: Partial<BaseContextSettings<OptionsShape>> = {},
) {
	if (!base.prepare) {
		return settings.options;
	}

	return await awaitLazyProperties(
		base.prepare({
			log: createFailingFunction("log", "the Base"),
			options: createFailingObject(
				"options",
				"the Base",
			) as InferredObject<OptionsShape>,
			take: createFailingFunction("take", "the Base"),
			...settings,
		}),
	);
}
