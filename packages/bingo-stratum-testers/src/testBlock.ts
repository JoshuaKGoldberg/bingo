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
	mode?: ProductionMode;
	offline?: boolean;
	options?: Options & StratumTemplateOptions;
}

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
