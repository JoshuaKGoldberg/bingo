import { AnyShape } from "bingo";
import slugify from "slugify";

import { Preset } from "../types/presets.js";

export function getPresetByName<OptionsShape extends AnyShape>(
	presets: Preset<OptionsShape>[],
	requested: string,
) {
	const presetsByName = new Map(
		Array.from(
			presets.map((preset) => [
				// @ts-expect-error -- https://github.com/simov/slugify/issues/196
				slugify(preset.about.name, { lower: true }),
				preset,
			]),
		),
	);

	return (
		// @ts-expect-error -- https://github.com/simov/slugify/issues/196
		presetsByName.get(slugify(requested, { lower: true })) ??
		new Error(
			`${requested} is not one of: ${Array.from(presetsByName.keys()).join(", ")}`,
		)
	);
}
