import { ProductionMode } from "bingo";

import { mergeBlockCreations } from "../mergers/mergeBlockCreations.js";
import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
import { BlockCreation } from "../types/creations.js";

/**
 * Settings to run a Block with {@link produceBlock} that might have addons.
 * @template Addons Schema of Block-specific args defined by the Block, if defined.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
export type ProduceBlockSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? ProduceBlockSettingsWithAddons<Addons, Options>
	: ProduceBlockSettingsWithoutAddons<Options>;

/**
 * Settings to run a Block with {@link produceBlock} that defines addons.
 * @template Addons Schema of Block-specific args defined by the Block.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
export interface ProduceBlockSettingsWithAddons<
	Addons extends object,
	Options extends object,
> extends ProduceBlockSettingsWithoutAddons<Options> {
	addons?: Addons;
}

/**
 * Settings to run a Block with {@link produceBlock} that does not define addons.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
export interface ProduceBlockSettingsWithoutAddons<Options extends object> {
	mode?: ProductionMode;
	offline?: boolean;
	options: Options;
}

/**
 * Produces a single Block that defines addons.
 * @template Addons Schema of Block-specific args defined by the Block, if defined.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: ProduceBlockSettingsWithAddons<Addons, Options>,
): Partial<BlockCreation<Options>>;
/**
 * Produces a single Block that does not define addons.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
export function produceBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: ProduceBlockSettingsWithoutAddons<Options>,
): Partial<BlockCreation<Options>>;
/**
 * Produces a single Block.
 * @template Addons Schema of Block-specific args defined by the Block, if defined.
 * @template Options Options values as described by the Block's Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/apis/producers#produceblock}
 */
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
