import { Creation } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { applyFilesToSystem } from "./applyFilesToSystem.js";
import { applyRequestsToSystem } from "./applyRequestsToSystem.js";
import { applyScriptsToSystem } from "./applyScriptsToSystem.js";

export interface ApplyCreationSettings {
	offline?: boolean;
	system: SystemContext;
}

export async function runCreation(
	creation: Partial<Creation>,
	{ offline, system }: ApplyCreationSettings,
) {
	if (creation.files) {
		await applyFilesToSystem(creation.files, system.fs, system.directory);
	}

	await Promise.all([
		creation.scripts && applyScriptsToSystem(creation.scripts, system),
		!offline &&
			creation.requests &&
			applyRequestsToSystem(creation.requests, system),
	]);
}
