import * as prompts from "@clack/prompts";
import { CachedFactory } from "cached-factory";

import { Display, DisplayItem } from "../../contexts/createDisplay.js";

export interface ClackDisplay extends Display {
	dumpItems(): SystemItemsDump;
	spinner: ClackSpinner;
}

// TODO: suggest making a type for all these things to Clack :)
// https://github.com/bombshell-dev/clack/issues/248
export type ClackSpinner = ReturnType<typeof prompts.spinner>;

export type SystemItemsDump = Record<string, Record<string, DisplayItem>>;

export function createClackDisplay(): ClackDisplay {
	const spinner = prompts.spinner();
	const groups = new CachedFactory<string, CachedFactory<string, DisplayItem>>(
		() => new CachedFactory(() => ({})),
	);

	const display = {
		item(group, id, item) {
			Object.assign(groups.get(group).get(id), item);
		},
		log(message) {
			// https://github.com/bingo-js/bingo/issues/343
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			process.stdout.moveCursor?.(0, -1);
			prompts.log.step(message + "\n");
		},
	} satisfies Display;

	return {
		...display,
		dumpItems(): SystemItemsDump {
			return Object.fromEntries(
				Array.from(groups.entries()).map(([key, factory]) => [
					key,
					Object.fromEntries(factory.entries()),
				]),
			);
		},
		spinner,
	};
}
