import { AboutBase, AnyOptionalShape, InferredObject } from "bingo";

import { BlockCreation, CreatedBlockAddons } from "./creations.js";

export type Block<
	Addons extends object | undefined = object | undefined,
	Options extends object = object,
> = Addons extends object
	? BlockWithAddons<Addons, Options>
	: BlockWithoutAddons<Options>;

export type BlockAugmentWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

export type BlockAugmentWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

export interface BlockBase {
	about?: AboutBase;
}

export interface BlockContextWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons: Addons;
	options: Options;
}

export interface BlockContextWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons?: Addons;
	options: Options;
}

export interface BlockContextWithoutAddons<Options extends object> {
	offline?: boolean;
	options: Options;
}

export type BlockDefinition<
	AddonsShape extends AnyOptionalShape | undefined,
	Options extends object,
> = AddonsShape extends object
	? BlockDefinitionWithAddons<AddonsShape, Options>
	: BlockDefinitionWithoutAddons<Options>;

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export type BlockDefinitionProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

export type BlockDefinitionProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

export interface BlockDefinitionWithAddons<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
> extends BlockDefinitionBase {
	addons: AddonsShape;
	produce: BlockDefinitionProducerWithAddons<
		InferredObject<AddonsShape>,
		Options
	>;
	setup?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;
	transition?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;
}

export interface BlockDefinitionWithoutAddons<Options extends object>
	extends BlockDefinitionBase {
	produce: BlockDefinitionProducerWithoutAddons<Options>;
	setup?: BlockAugmentWithoutAddons<Options>;
	transition?: BlockAugmentWithoutAddons<Options>;
}

export type BlockProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithOptionalAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

export type BlockProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

export interface BlockWithAddons<Addons extends object, Options extends object>
	extends BlockBase {
	produce: BlockProducerWithAddons<Addons, Options>;
	setup?: BlockAugmentWithAddons<Addons, Options>;
	transition?: BlockAugmentWithAddons<Addons, Options>;
	(addons: Partial<Addons>): CreatedBlockAddons<Addons, Options>;
}

export interface BlockWithoutAddons<Options extends object> extends BlockBase {
	produce: BlockProducerWithoutAddons<Options>;
	setup?: BlockAugmentWithoutAddons<Options>;
	transition?: BlockAugmentWithoutAddons<Options>;
}
