import { Block } from "./blocks.js";
import { CreatedBlockAddons } from "./creations.js";

/**
 * Blocks to add and/or exclude from production.
 * @template Options Options values as described by the template's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/details/configurations#blocks}
 */
export interface BlockRefinements<Options extends object = object> {
	add?: Block<object | undefined, Options>[];
	exclude?: Block<object | undefined, Options>[];
}

/**
 * Customizations that all Stratum templates may apply in a config file.
 * @template Options Options values as described by the template's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/details/configurations#settings}
 */
export interface StratumRefinements<Options extends object = object> {
	/**
	 * Any extra addon values to merge in and pass to blocks.
	 */
	// TODO: Get this to work with object or never...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, Options>[];

	/**
	 * Blocks to add and/or exclude from production.
	 */
	blocks?: BlockRefinements<Options>;
}
