import { BingoSystem } from "bingo-systems";

import { createSystemContext } from "../contexts/createSystemContext.js";
import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Template } from "../types/templates.js";

export interface ProduceTemplateSettings<OptionsShape extends AnyShape>
	extends Partial<BingoSystem> {
	mode?: ProductionMode;
	offline?: boolean;
	options: InferredObject<OptionsShape>;
}

export function produceTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: ProduceTemplateSettings<OptionsShape>,
): Partial<Creation> {
	const system = createSystemContext({
		directory: ".",
		...settings,
	});

	const context = { ...settings, ...system };
	let creation = template.produce(context);

	const augmenter = settings.mode && template[settings.mode];
	if (augmenter) {
		creation = mergeCreations(creation, augmenter(context));
	}

	return creation;
}
