import { Creation } from "bingo";

import { BlockWithAddons } from "./blocks.js";

export interface BlockCreation<Options extends object> extends Creation {
	// TODO: Figure out how to replace this with ... never? object?
	// Note it needs to pass tsc both in this repo and in create-typescript-app.
	// https://github.com/JoshuaKGoldberg/bingo/issues/283
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons: CreatedBlockAddons<any, Options>[];
}

export interface CreatedBlockAddons<
	Addons extends object = object,
	Options extends object = object,
> {
	addons: Addons;
	block: BlockWithAddons<Addons, Options>;
}
