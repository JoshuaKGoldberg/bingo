import { BingoSystem } from "bingo-systems";
import fs from "node:fs/promises";

import { createSystemContextWithAuth } from "../contexts/createSystemContextWithAuth.js";
import { AnyShape, InferredObject } from "../options.js";
import { produceTemplate } from "../producers/produceTemplate.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Template } from "../types/templates.js";
import { runCreation } from "./runCreation.js";

export interface RunSettingsBase extends Partial<BingoSystem> {
	auth?: string;
	directory?: string;
	mode?: ProductionMode;
	offline?: boolean;
}

export interface RunTemplateSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	offline?: boolean;
	options: InferredObject<OptionsShape>;
}

export async function runTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: RunTemplateSettings<OptionsShape>,
): Promise<Partial<Creation>> {
	const { directory = ".", offline } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const creation = produceTemplate(template, { ...system, ...settings });

	await runCreation(creation, { offline, system });

	return creation;
}
