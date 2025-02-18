import { PresetAbout } from "../types/presets.js";

export function isPresetAbout(value: unknown): value is PresetAbout {
	return !!value && typeof value === "object" && "name" in value;
}
