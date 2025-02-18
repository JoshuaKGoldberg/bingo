import { AboutBase } from "bingo";

import { PresetDefinition } from "../types/presets.js";

export function assertNoDuplicateBlocks<Options extends object>(
	presetDefinition: PresetDefinition<Options>,
) {
	const presetName = getName(presetDefinition);
	const seen = new Set();

	for (const block of presetDefinition.blocks) {
		if (seen.has(block)) {
			throw new Error(
				`Preset ${presetName} has duplicate Block: ${getName(block)}`,
			);
		}
	}
}

function getName(value: { about?: AboutBase }) {
	return value.about?.name ?? "(anonymous)";
}
