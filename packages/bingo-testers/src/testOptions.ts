import {
	AnyShape,
	awaitLazyProperties,
	HasOptionsAndMaybePrepare,
	InferredObject,
	OptionsContext,
} from "bingo";

import { createFailingFunction } from "./utils.js";

export interface TestOptionsSettings<OptionsShape extends AnyShape>
	extends Partial<OptionsContext<InferredObject<OptionsShape>>> {
	existing: Partial<InferredObject<OptionsShape>>;
}

export async function testOptions<OptionsShape extends AnyShape>(
	base: HasOptionsAndMaybePrepare<OptionsShape>,
	context: Partial<OptionsContext<InferredObject<OptionsShape>>>,
) {
	if (!base.prepare) {
		return context.options;
	}

	return await awaitLazyProperties({
		...base.prepare({
			...context,
			log: createFailingFunction("log", "prepare()"),
			options: {},
			take: createFailingFunction("take", "prepare()"),
		}),
		...context.options,
	});
}
