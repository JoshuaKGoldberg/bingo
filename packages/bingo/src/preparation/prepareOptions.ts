import { BingoSystem } from "bingo-systems";

import { createSystemContextWithAuth } from "../contexts/createSystemContextWithAuth.js";
import { AnyShape, InferredObject } from "../options.js";
import { LazyOptionalOptions, OptionsContext } from "../types/options.js";
import { awaitLazyProperties } from "../utils/awaitLazyProperties.js";

export interface HasOptionsAndPrepare<OptionsShape extends AnyShape> {
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

export async function prepareOptions<OptionsShape extends AnyShape>(
	base: HasOptionsAndPrepare<OptionsShape>,
	settings: PrepareOptionsSettings<OptionsShape> = {},
): Promise<Partial<InferredObject<OptionsShape>>> {
	console.log({ base });
	const { existing = {} } = settings;
	if (!base.prepare) {
		console.log("no prepare", { existing });
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
