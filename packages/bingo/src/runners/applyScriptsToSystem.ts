import { CreatedScript } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { groupBy } from "../utils/groupBy.js";

export async function applyScriptsToSystem(
	scripts: CreatedScript[],
	system: Pick<SystemContext, "display" | "runner">,
) {
	const scriptsByPhase = groupBy(
		scripts.filter((script) => typeof script === "object"),
		(script) => script.phase ?? Infinity,
	);
	const commandsStandalone = scripts.filter(
		(script) => typeof script === "string",
	);

	const phaseKeys = Object.keys(scriptsByPhase)
		.map((key) => Number(key))
		.sort();

	async function runCommand(command: string, silent?: boolean) {
		system.display.item("script", command, { start: Date.now() });
		const result = await system.runner(command);
		system.display.item("script", command, { end: Date.now() });

		if (result instanceof Error && !silent) {
			system.display.item("script", command, { error: result });
		}
	}

	const commandsStandaloneTask = Promise.all(
		commandsStandalone.map(async (command) => {
			await runCommand(command);
		}),
	);

	for (const phase of phaseKeys) {
		await Promise.all(
			scriptsByPhase[phase].map(async (script) => {
				for (const command of script.commands) {
					await runCommand(command, script.silent);
				}
			}),
		);
	}

	await commandsStandaloneTask;
}
