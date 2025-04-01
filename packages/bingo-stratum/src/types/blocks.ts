import { AboutBase, AnyOptionalShape, InferredObject } from "bingo";
import { IntakeDirectory } from "bingo-fs";

import { BlockCreation, CreatedBlockAddons } from "./creations.js";
import { StratumTemplateOptions } from "./templates.js";

/**
 * Logic to create one portion of a repository.
 * @template Addons Block-specific extensions, if defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export type Block<
	Addons extends object | undefined = object | undefined,
	Options extends object = object,
> = Addons extends object
	? BlockWithAddons<Addons, Options>
	: BlockWithoutAddons<Options>;

/**
 * Augments additional creations into a production from a Block with addons.
 * @param context Shared Block helper functions and information.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export type BlockAugmentWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

/**
 * Augments additional creations into a production from a Block without addons.
 * @param context Shared Block helper functions and information.
 * @template Options Options values as described by the Base's options schema.
 */
export type BlockAugmentWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

export interface BlockBase {
	/**
	 * Metadata about the Block that can be used by tooling to describe it.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-about}
	 */
	about?: AboutBase;
}

/**
 * Shared helper functions and information passed to producers of Blocks with required Addons.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockContextWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons: Addons;
}

/**
 * Shared helper functions and information passed to Block intake()s.
 */
export interface BlockIntakeContext {
	/**
	 * Any existing files on disk.
	 */
	files: IntakeDirectory;
}

/**
 * Shared helper functions and information passed to producers of Blocks with optional Addons.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockContextWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons?: Addons;
}

/**
 * Shared helper functions and information passed to producers of Blocks without Addons.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockContextWithoutAddons<Options extends object> {
	offline?: boolean;
	options: Options & StratumTemplateOptions;
}

/**
 * Definition for creating a new Block that may have Addons.
 * @template AddonsShape Schema of Addons the Block takes in, if defined.
 * @template Options Options values as described by the Base's options schema.
 */
export type BlockDefinition<
	AddonsShape extends AnyOptionalShape | undefined,
	Options extends object,
> = AddonsShape extends object
	? BlockDefinitionWithAddons<AddonsShape, Options>
	: BlockDefinitionWithoutAddons<Options>;

/**
 * Generates the creations describing a portion of a repository from a Block with Addons.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export type BlockDefinitionProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

/**
 * Generates the creations describing a portion of a repository from a Block without Addons.
 * @template Options Options values as described by the Base's options schema.
 */
export type BlockDefinitionProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

/**
 * Definition for creating a new Block with Addons.
 * @template AddonsShape Schema of Addons the Block takes in.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockDefinitionWithAddons<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
> extends BlockBase {
	/**
	 * Schema of Addons the Block takes in.
	 */
	addons: AddonsShape;

	/**
	 * Infers Addons from existing files in the repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-intake}
	 */
	intake?: BlockIntake<InferredObject<AddonsShape>>;

	/**
	 * Generates the creations describing a portion of a repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-produce}
	 */
	produce: BlockDefinitionProducerWithAddons<
		InferredObject<AddonsShape>,
		Options
	>;

	/**
	 * Augments a Block creation with additional creations for setup mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-setup}
	 */
	setup?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;

	/**
	 * Augments a Block creation with additional creations for transition mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-transition}
	 */
	transition?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;
}

/**
 * Definition for creating a new Block without Addons.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockDefinitionWithoutAddons<Options extends object>
	extends BlockBase {
	/**
	 * Generates the creations describing a portion of a repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-produce}
	 */
	produce: BlockDefinitionProducerWithoutAddons<Options>;

	/**
	 * Augments a Block creation with additional creations for setup mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-setup}
	 */
	setup?: BlockAugmentWithoutAddons<Options>;

	/**
	 * Augments a Block creation with additional creations for transition mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-transition}
	 */
	transition?: BlockAugmentWithoutAddons<Options>;
}

/**
 * Infers any Addons for the Block from existing creations.
 * @param context Shared Block helper functions and information.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 */
export type BlockIntake<Addons extends object> = (
	context: BlockIntakeContext,
) => Partial<Addons> | undefined;

/**
 * Generates the creations describing a portion of a repository with addons.
 * @param context Shared Block helper functions and information.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the template's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/concepts/blocks#production}
 */
export type BlockProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithOptionalAddons<Addons, Options>,
) => Partial<BlockCreation<Options>>;

/**
 * Generates the creations describing a portion of a repository without addons.
 * @param context Shared Block helper functions and information.
 * @template Options Options values as described by the template's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/concepts/blocks#production}
 */
export type BlockProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<BlockCreation<Options>>;

/**
 * Block that defines a schema for Addons.
 * @template Addons Block-specific extensions, as defined by the Block's schema.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockWithAddons<Addons extends object, Options extends object>
	extends BlockBase {
	/**
	 * Infers Addons from existing files in the repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-intake}
	 */
	intake?: BlockIntake<Addons>;

	/**
	 * Generates the creations describing a portion of a repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-produce}
	 */
	produce: BlockProducerWithAddons<Addons, Options>;

	/**
	 * Augments a Block creation with additional creations for setup mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-setup}
	 */
	setup?: BlockAugmentWithAddons<Addons, Options>;

	/**
	 * Augments a Block creation with additional creations for transition mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-transition}
	 */
	transition?: BlockAugmentWithAddons<Addons, Options>;

	/**
	 * Creates a description of Addons to provide for the Block.
	 */
	(addons: Partial<Addons>): CreatedBlockAddons<Addons, Options>;
}

/**
 * Block that does not define a schema for Addons.
 * @template Options Options values as described by the Base's options schema.
 */
export interface BlockWithoutAddons<Options extends object> extends BlockBase {
	/**
	 * Generates the creations describing a portion of a repository.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-produce}
	 */
	produce: BlockProducerWithoutAddons<Options>;

	/**
	 * Augments a Block creation with additional creations for setup mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-setup}
	 */
	setup?: BlockAugmentWithoutAddons<Options>;

	/**
	 * Augments a Block creation with additional creations for transition mode.
	 * @template Options Options values as described by the Base's options schema.
	 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base#createblock-transition}
	 */
	transition?: BlockAugmentWithoutAddons<Options>;
}
