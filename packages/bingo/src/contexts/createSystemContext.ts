import {
	BingoSystem,
	createSystemFetchers,
	createSystemFetchersOffline,
	createSystemRunner,
	createWritingFileSystem,
} from "bingo-systems";

import { createDisplay, Display } from "./createDisplay.js";
import { createTake } from "./createTake.js";

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

	return {
		...system,
		directory: settings.directory,
		display: settings.display ?? createDisplay(),
		take: createTake(system),
	};
}
