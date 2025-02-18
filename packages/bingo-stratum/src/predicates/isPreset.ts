import { Preset } from "../types/presets.js";
import { isBase } from "./isBase.js";
import { isPresetAbout } from "./isPresetAbout.js";

export function isPreset(value: unknown): value is Preset {
	return (
		!!value &&
		typeof value === "object" &&
		"about" in value &&
		isPresetAbout(value.about) &&
		"base" in value &&
		isBase(value.base) &&
		"blocks" in value &&
		Array.isArray(value.blocks)
	);
}
