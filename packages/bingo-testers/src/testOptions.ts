import {
	AnyShape,
	awaitLazyProperties,
	HasOptionsAndMaybePrepare,
	InferredObject,
	OptionsContext,
} from "bingo";

import { createFailingFunction } from "./utils.js";

export async function testOptions<OptionsShape extends AnyShape>(
	base: HasOptionsAndMaybePrepare<OptionsShape>,
	context: Partial<OptionsContext<InferredObject<OptionsShape>>> = {},
) {
	if (!base.prepare) {
		return context.options;
	}

	return await awaitLazyProperties({
		...base.prepare({
			...context,
			log: context.log ?? createFailingFunction("log", "prepare()"),
			options: context.options ?? {},
			take: context.take ?? createFailingFunction("take", "prepare()"),
		}),
		...context.options,
	});
}
