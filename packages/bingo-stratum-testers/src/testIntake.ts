import { IntakeDirectory } from "bingo-fs";
import { BlockWithAddons } from "bingo-stratum";
import { StratumTemplateOptions } from "bingo-stratum/lib/types/templates.js";

import { createFailingObject } from "./utils.js";

export interface TestIntakeSettings<Options extends object> {
	/**
	 * Existing file creations, if available.
	 */
	files: IntakeDirectory;

	/**
	 * Any options values as described by the Block's Base's options schema, as well as preset.
	 */
	options?: Options & StratumTemplateOptions;
}

/**
 * Simulates running a Block's intake in-memory for tests.
 * @see {@link https://www.create.bingo/engines/stratum/packages/bingo-stratum-testers/#testintake}
 */
export function testIntake<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: TestIntakeSettings<Options>,
): Partial<Addons> | undefined {
	return block.intake?.({
		...settings,
		options:
			settings.options ??
			(createFailingObject("options", "the Block") as Options),
	});
}
