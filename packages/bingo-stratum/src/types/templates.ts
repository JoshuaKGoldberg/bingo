import {
	AnyShape,
	InferredObject,
	TemplateAbout,
	TemplateContext,
	TemplatePrepare,
} from "bingo";
import { z } from "zod";

import { Base } from "./bases.js";
import { BlockCreation } from "./creations.js";
import { Preset } from "./presets.js";

export interface StratumTemplate<OptionsShape extends AnyShape = AnyShape> {
	about?: TemplateAbout;
	base: Base<OptionsShape>;
	options: OptionsShape & StratumTemplateOptionsShape;
	presets: Preset<OptionsShape>[];
	produce: StratumTemplateProduce<InferredObject<OptionsShape>>;
}

export interface StratumTemplateDefinition<
	OptionsShape extends AnyShape = AnyShape,
> {
	about?: TemplateAbout;
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;
	presets: Preset<OptionsShape>[];
	suggested?: Preset<OptionsShape>;
}

export interface StratumTemplateOptionsShape {
	preset: z.ZodString;
}

export type StratumTemplateProduce<Options extends object> = (
	context: TemplateContext<Options & { preset: string }>,
) => Partial<BlockCreation<Options>>;
