import * as fs from "node:fs/promises";
import path from "node:path";

import { ProductionMode } from "../types/modes.js";
import { tryCatchSafe } from "../utils/tryCatch.js";
import { ProductionSettings } from "./types.js";

export interface ReadProductionSettingsOptions {
	directory?: string;
	mode?: ProductionMode;
}

export async function readProductionSettings({
	directory = ".",
	mode,
}: ReadProductionSettingsOptions = {}): Promise<Error | ProductionSettings> {
	const items = await tryCatchSafe(fs.readdir(directory));
	let defaultMode: ProductionMode = mode ?? "setup";

	if (!items) {
		return defaultMode === "transition"
			? new Error(
					"Cannot run with --mode transition on a directory that does not yet exist.",
				)
			: { mode: defaultMode };
	}

	for (const item of items) {
		if (/bingo\.config\.\w+/.test(item)) {
			return {
				configFile: path.join(directory, item),
				mode: "transition",
			};
		}

		if (item === ".git" && mode !== "setup") {
			defaultMode = "transition";
		}
	}

	return {
		mode: defaultMode,
	};
}
