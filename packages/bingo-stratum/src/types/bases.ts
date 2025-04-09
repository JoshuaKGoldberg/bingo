// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable jsdoc/text-escaping -- https://github.com/gajus/eslint-plugin-jsdoc/issues/1360 */
import {
	AnyOptionalShape,
	AnyShape,
	InferredObject,
	TemplatePrepare,
} from "bingo";

import {
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "./blocks.js";
import { Preset, PresetDefinition } from "./presets.js";
import { StratumRefinements } from "./refinements.js";
import { StratumTemplate, StratumTemplateDefinition } from "./templates.js";

/**
 * Shared options and creator APIs to create a Template from Blocks and Presets.
 * @template OptionsShape Schemas of options the Base's Blocks take in.
 * @see {@link https://www.create.bingo/engines/stratum/concepts/bases}
 */
export interface Base<OptionsShape extends AnyShape = AnyShape> {
	createBlock: CreateBlock<InferredObject<OptionsShape>>;
	createPreset: CreatePreset<OptionsShape>;
	createStratumTemplate: CreateStratumTemplate<OptionsShape>;
	options: OptionsShape;
	prepare?: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;
}

/**
 * Definition for creating a new Stratum {@link Base}.
 * @template OptionsShape Schemas of options the Base's Blocks take in.
 * @see {@link https://www.create.bingo/engines/stratum/apis/create-base}
 */
export interface BaseDefinition<OptionsShape extends AnyShape = AnyShape> {
	options: OptionsShape;
	prepare?: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;
}

/**
 * Utility type to retrieve the inferred options shape from a Base's schema type.
 * @example
 * ```ts
 * import { createBase } from "bingo-stratum";
 * import { z } from "zod";
 *
 * export const base = createBase({ options: { value: z.number() }});
 *
 * // { value: number }
 * export type BaseOptions = BaseOptionsFor<typeof base>;
 * ```
 */
export type BaseOptionsFor<TypeOfBase> = TypeOfBase extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;

/**
 * Factory function to create Blocks.
 * @template Options Options values as described by the Base's options schema.
 * @see {@link https://www.create.bingo/engines/stratum/concepts/blocks}
 */
export interface CreateBlock<Options extends object> {
	<AddonsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
	): BlockWithAddons<InferredObject<AddonsShape>, Options>;

	(
		blockDefinition: BlockDefinitionWithoutAddons<Options>,
	): BlockWithoutAddons<Options>;
}

/**
 * Factory function to create Blocks.
 * @template OptionsShape Schemas of options defined by the parent Base.
 */
export type CreatePreset<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
) => Preset<OptionsShape>;

/**
 * Factory function to create Templates.
 * @template OptionsShape Schemas of options defined by the parent Base.
 */
export type CreateStratumTemplate<OptionsShape extends AnyShape> = (
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
) => StratumTemplate<OptionsShape>;
