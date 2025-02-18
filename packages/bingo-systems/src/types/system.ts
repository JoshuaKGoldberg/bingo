import { SystemFetchers } from "../fetchers/types.js";
import { WritingFileSystem } from "../files/types.js";
import { SystemRunner } from "../runner/runner.js";

export interface BingoSystem {
	fetchers: SystemFetchers;
	fs: WritingFileSystem;
	runner: SystemRunner;
}
