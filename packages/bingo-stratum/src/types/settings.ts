import { Block } from "../types/blocks.js";

export interface BlockModifications<Options extends object = object> {
	add?: Block<object | undefined, Options>[];
	exclude?: Block<object | undefined, Options>[];
}

export interface StratumSettings<Options extends object = object> {
	blocks?: BlockModifications<Options>;
}
