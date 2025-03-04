import { SystemFetchers } from "../fetchers/types.js";
import { WritingFileSystem } from "../files/types.js";
import { SystemRunner } from "../runner/runner.js";

/**
 * Shared APIs used by Bingo preparers, producers, and runners.
 */
export interface BingoSystem {
	/**
	 * APIs to send network requests.
	 */
	fetchers: SystemFetchers;

	/**
	 * APIs to read from and write to a file system.
	 */
	fs: WritingFileSystem;

	/**
	 * Executes a command in the system shell.
	 */
	runner: SystemRunner;
}
