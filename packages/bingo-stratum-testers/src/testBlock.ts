import { ProductionMode } from "bingo";
import {
	BlockWithAddons,
	BlockWithoutAddons,
	produceBlock,
	ProduceBlockSettingsWithAddons,
} from "bingo-stratum";
import { BlockCreation } from "bingo-stratum/lib/types/creations.js";
import { StratumTemplateOptions } from "bingo-stratum/lib/types/templates.js";

import { createFailingObject } from "./utils.js";

export interface BlockContextSettingsWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextSettingsWithoutAddons<Options> {
	addons?: Partial<Addons>;
}

export interface BlockContextSettingsWithoutAddons<Options extends object> {
	/**
	 * Which repository mode Bingo to simulate being run in.
	 * @see {@link https://create.bingo/build/concepts/modes}
	 */
	mode?: ProductionMode;

	/**
	 * Whether to simulate being run in an "offline" mode.
	 * @see {@link http://create.bingo/build/details/contexts#options-offline}
	 */
	offline?: boolean;

	/**
	 * Any options values as described by the Block's Base's options schema, as well as preset.
	 */
	options?: Options & StratumTemplateOptions;
}

/**
 * Simulates running a Block in-memory for tests.
 * @see {@link https://www.create.bingo/engines/stratum/packages/bingo-stratum-testers/#testblock}
 */
export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockContextSettingsWithOptionalAddons<Addons, Options>,
): Partial<BlockCreation<Options>>;
export function testBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings?: BlockContextSettingsWithoutAddons<Options>,
): Partial<BlockCreation<Options>>;
export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockContextSettingsWithOptionalAddons<Addons, Options> = {},
): Partial<BlockCreation<Options>> {
	return produceBlock(
		block as BlockWithAddons<Addons, Options>,
		{
			addons: {},
			options: createFailingObject("options", "the Block") as Options,
			...settings,
		} as ProduceBlockSettingsWithAddons<Addons, Options>,
	);
}
