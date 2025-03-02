import { TakeInput } from "bingo";
import { BingoSystem } from "bingo-systems";

import { createMockFetchers } from "./createMockFetchers.js";
import { createMockFileSystem } from "./createMockFileSystem.js";
import { createMockTake } from "./createMockTake.js";
import { MockSystemOptions } from "./types.js";
import { createFailingFunction } from "./utils.js";

export interface MockSystems {
	system: BingoSystem;
	take: TakeInput;
}

export function createMockSystems(
	settings: MockSystemOptions = {},
): MockSystems {
	const fetchers = settings.fetchers ?? createMockFetchers();
	const fs = createMockFileSystem(settings.fs);
	const runner = settings.runner ?? createFailingFunction("runner", "an input");

	const system = { fetchers, fs, runner };

	const take =
		settings.take ??
		createMockTake(createFailingFunction("runner", "an input"));

	return { system, take };
}
