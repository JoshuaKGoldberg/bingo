import { ProductionMode } from "bingo";

import { mergeBlockCreations } from "../mergers/mergeBlockCreations.js";
import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
import { BlockCreation } from "../types/creations.js";

export type ProduceBlockSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? ProduceBlockSettingsWithAddons<Addons, Options>
	: ProduceBlockSettingsWithoutAddons<Options>;

export interface ProduceBlockSettingsWithAddons<
	Addons extends object,
	Options extends object,
> extends ProduceBlockSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export interface ProduceBlockSettingsWithoutAddons<Options extends object> {
	mode?: ProductionMode;
	offline?: boolean;
	options: Options;
}

export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: ProduceBlockSettingsWithAddons<Addons, Options>,
): Partial<BlockCreation<Options>>;
export function produceBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: ProduceBlockSettingsWithoutAddons<Options>,
): Partial<BlockCreation<Options>>;
export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: ProduceBlockSettings<Addons, Options>,
): Partial<BlockCreation<Options>> {
	let creation = block.produce(settings);

	const augment = settings.mode && block[settings.mode];
	if (augment) {
		const augmented = augment({
			addons: {} as Addons,
			...settings,
		});
		creation = mergeBlockCreations(creation, augmented);
	}

	return creation;
}
