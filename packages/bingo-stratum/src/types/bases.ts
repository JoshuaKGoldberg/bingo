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
import { StratumTemplate, StratumTemplateDefinition } from "./templates.js";

export interface Base<OptionsShape extends AnyShape = AnyShape> {
	createBlock: CreateBlock<InferredObject<OptionsShape>>;
	createPreset: CreatePreset<OptionsShape>;
	createStratumTemplate: CreateStratumTemplate<OptionsShape>;
	options: OptionsShape;
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;
}

export interface BaseDefinition<OptionsShape extends AnyShape = AnyShape> {
	options: OptionsShape;
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;
}

export type BaseOptionsFor<TypeOfBase> = TypeOfBase extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;

export interface CreateBlock<Options extends object> {
	<AddonsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
	): BlockWithAddons<InferredObject<AddonsShape>, Options>;

	(
		blockDefinition: BlockDefinitionWithoutAddons<Options>,
	): BlockWithoutAddons<Options>;
}

export type CreatePreset<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
) => Preset<OptionsShape>;

export type CreateStratumTemplate<OptionsShape extends AnyShape> = (
	templateDefinition: StratumTemplateDefinition<OptionsShape>,
) => StratumTemplate<OptionsShape>;
