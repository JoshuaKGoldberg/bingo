import { AnyShape } from "bingo";

import { Preset } from "../types/presets.js";
import { slugifyPresetName } from "./slugifyPresetName.js";

export function getPresetByName<OptionsShape extends AnyShape>(
	presets: Preset<OptionsShape>[],
	requested: string,
) {
	const presetsByName = new Map(
		Array.from(
			presets.map((preset) => [slugifyPresetName(preset.about.name), preset]),
		),
	);

	return (
		presetsByName.get(slugifyPresetName(requested)) ??
		new Error(
			`${requested} is not one of: ${Array.from(presetsByName.keys()).join(", ")}`,
		)
	);
}
