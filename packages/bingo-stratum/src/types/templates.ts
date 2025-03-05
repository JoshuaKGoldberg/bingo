import {
	AnyShape,
	InferredObject,
	Template,
	TemplateAbout,
	TemplateContext,
	TemplatePrepare,
} from "bingo";
import { z } from "zod";

import { Base } from "./bases.js";
import { BlockCreation } from "./creations.js";
import { Preset } from "./presets.js";
import { StratumRefinements } from "./refinements.js";

export interface StratumTemplate<OptionsShape extends AnyShape>
	extends Template<
		OptionsShape & StratumTemplateOptionsShape,
		StratumRefinements<InferredObject<OptionsShape>>
	> {
	base: Base<OptionsShape>;
	prepare: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;
	presets: Preset<OptionsShape>[];
}

export interface StratumTemplateDefinition<OptionsShape extends AnyShape> {
	about?: TemplateAbout;
	prepare?: TemplatePrepare<
		InferredObject<OptionsShape>,
		StratumRefinements<InferredObject<OptionsShape>>
	>;
	presets: Preset<OptionsShape>[];
	suggested?: Preset<OptionsShape>;
}

export interface StratumTemplateOptionsShape {
	preset: z.ZodUnion<ZodPresetNameLiterals>;
}

export type StratumTemplateProduce<Options extends object> = (
	context: TemplateContext<
		Options & { preset: string },
		StratumRefinements<Options>
	>,
) => Partial<BlockCreation<Options>>;

export type ZodPresetNameLiterals = [
	z.ZodLiteral<string>,
	z.ZodLiteral<string>,
	...z.ZodLiteral<string>[],
];
