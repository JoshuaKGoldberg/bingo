import { BingoSystem } from "bingo-systems";

import { createSystemContextWithAuth } from "../contexts/createSystemContextWithAuth.js";
import { LazyOptionalOptions, OptionsContext } from "../types/options.js";
import { AnyShape, InferredObject } from "../types/shapes.js";
import { awaitLazyProperties } from "../utils/awaitLazyProperties.js";

/**
 * Any object that has options, and optionally a prepare function.
 * This is commonly a Template, but can also be objects from custom engines.
 * @see {@link prepareOptions}
 * @see {@link http://create.bingo/build/apis/prepare-options}
 */
export interface HasOptionsAndMaybePrepare<OptionsShape extends AnyShape> {
	options: OptionsShape;
	prepare?: (
		context: OptionsContext<InferredObject<OptionsShape>>,
	) => LazyOptionalOptions<Partial<InferredObject<OptionsShape>>>;
}

export interface PrepareOptionsSettings<OptionsShape extends AnyShape>
	extends Partial<BingoSystem> {
	directory?: string;
	existing?: Partial<InferredObject<OptionsShape>>;
	offline?: boolean;
}

/**
 * Loads inferred values for any options not explicitly provided in settings,
 * if the base's prepare exists. Returns the existing settings otherwise.
 * @see {@link http://create.bingo/build/apis/prepare-options}
 */
export async function prepareOptions<OptionsShape extends AnyShape>(
	base: HasOptionsAndMaybePrepare<OptionsShape>,
	settings: PrepareOptionsSettings<OptionsShape> = {},
): Promise<Partial<InferredObject<OptionsShape>>> {
	const { existing = {} } = settings;
	if (!base.prepare) {
		return existing;
	}

	const system = await createSystemContextWithAuth({
		directory: settings.directory ?? ".",
		...settings,
	});

	return await awaitLazyProperties(
		base.prepare({
			options: existing,
			...system,
		}),
	);
}
