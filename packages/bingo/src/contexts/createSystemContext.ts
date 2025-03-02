import {
	BingoSystem,
	createSystemFetchers,
	createSystemFetchersOffline,
	createSystemRunner,
	createWritingFileSystem,
} from "bingo-systems";

import { TakeInput } from "../types/inputs.js";
import { createDisplay, Display } from "./createDisplay.js";

export interface SystemContextSettings extends Partial<BingoSystem> {
	auth?: string;
	directory: string;
	display?: Display;
	offline?: boolean;
}

export function createSystemContext(settings: SystemContextSettings) {
	const system: BingoSystem = {
		fetchers:
			settings.fetchers ??
			(settings.offline
				? createSystemFetchersOffline()
				: createSystemFetchers(settings)),
		fs: settings.fs ?? createWritingFileSystem(),
		runner: settings.runner ?? createSystemRunner(settings.directory),
	};

	const take = ((input, args) =>
		input({ args, offline: settings.offline, take, ...system })) as TakeInput;

	return {
		...system,
		directory: settings.directory,
		display: settings.display ?? createDisplay(),
		take,
	};
}
