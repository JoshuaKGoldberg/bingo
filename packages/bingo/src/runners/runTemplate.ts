import { IntakeDirectory } from "bingo-fs";
import { BingoSystem } from "bingo-systems";
import fs from "node:fs/promises";

import { createSystemContextWithAuth } from "../contexts/createSystemContextWithAuth.js";
import { produceTemplate } from "../producers/produceTemplate.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { AnyShape, InferredObject } from "../types/shapes.js";
import { Template } from "../types/templates.js";
import { runCreation } from "./runCreation.js";

/**
 * Settings to run a template with {@link runTemplate}.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/run-template#settings}
 */
export interface RunTemplateSettings<OptionsShape extends AnyShape, Refinements>
	extends Partial<BingoSystem> {
	/**
	 * Current working directory ("cwd") path to use for the file system and running scripts.
	 */
	directory?: string;

	/**
	 * Existing file creations, if in transition mode.
	 */
	files?: IntakeDirectory;

	/**
	 * Which repository mode Bingo is being run in.
	 * @see {@link https://create.bingo/build/concepts/modes}
	 */
	mode?: ProductionMode;

	/**
	 * Whether to run in an "offline" mode that skips network requests.
	 */
	offline?: boolean;

	/**
	 * Options values as described by the template's options schema.
	 */
	options: InferredObject<OptionsShape>;

	/**
	 * Any optional customizations from a template-specific config file.
	 */
	refinements?: Refinements;
}

/**
 * Generates and applies Creation output for a template.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/run-template}
 */
export async function runTemplate<OptionsShape extends AnyShape, Refinements>(
	template: Template<OptionsShape, Refinements>,
	settings: RunTemplateSettings<OptionsShape, Refinements>,
): Promise<Partial<Creation>> {
	const { directory = ".", offline } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const creation = await produceTemplate(template, { ...system, ...settings });

	await runCreation(creation, { offline, system });

	return creation;
}
