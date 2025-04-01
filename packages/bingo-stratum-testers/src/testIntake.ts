import { IntakeDirectory } from "bingo-fs";
import { BlockWithAddons } from "bingo-stratum";

export interface TestIntakeSettings {
	/**
	 * Existing file creations, if available.
	 */
	files: IntakeDirectory;
}

/**
 * Simulates running a Block's intake in-memory for tests.
 * @see {@link https://www.create.bingo/engines/stratum/packages/bingo-stratum-testers/#testintake}
 */
export function testIntake<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: TestIntakeSettings,
): Partial<Addons> | undefined {
	return block.intake?.(settings);
}
