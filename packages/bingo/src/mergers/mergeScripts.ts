import hashObject from "hash-object";

import { CreatedScript, CreatedScriptWithOptions } from "../types/creations.js";

export function mergeScripts(
	first: CreatedScript[],
	second: CreatedScript[],
): CreatedScript[] {
	const commandsByPhase = new Map<number | undefined, string[][]>();
	const commandsWithoutPhase: string[] = [];
	const nonSilentPhaseScripts = new Set<string>();

	for (const command of [...first, ...second]) {
		if (typeof command === "string") {
			commandsWithoutPhase.push(command);
			continue;
		}

		if (!command.silent) {
			nonSilentPhaseScripts.add(makeSilenceHash(command));
		}

		const byPhase = commandsByPhase.get(command.phase);
		if (!byPhase) {
			commandsByPhase.set(command.phase, [command.commands.slice()]);
			continue;
		}

		for (const existing of byPhase) {
			if (existing.length <= command.commands.length) {
				if (firstHasSameStart(existing, command.commands)) {
					existing.push(...command.commands.slice(existing.length));
				} else {
					byPhase.push(command.commands);
				}
			} else if (!firstHasSameStart(command.commands, existing)) {
				byPhase.push(command.commands);
			}
		}
	}

	const seenPhaseCommands = new Set<string>();

	return [
		...Array.from(commandsByPhase).flatMap(([phase, phaseCommands]) =>
			phaseCommands
				.map((commands) => ({
					commands,
					phase,
					...(!nonSilentPhaseScripts.has(
						makeSilenceHash({ commands, phase }),
					) && {
						silent: true,
					}),
				}))
				.filter((phaseCommand) => {
					const hash = hashObject(phaseCommand);
					if (seenPhaseCommands.has(hash)) {
						return false;
					}

					seenPhaseCommands.add(hash);
					return true;
				}),
		),
		...new Set(commandsWithoutPhase),
	];
}

function firstHasSameStart(first: string[], second: string[]) {
	return first.every((entry, i) => entry === second[i]);
}

function makeSilenceHash(command: CreatedScriptWithOptions) {
	return hashObject([command.phase, command.commands]);
}
