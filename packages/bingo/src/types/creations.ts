import { CreatedDirectory } from "bingo-fs";
import { CreatedRequest } from "bingo-requests";
import { SystemFetchers } from "bingo-systems";

export type CreatedRequestSender = (fetchers: SystemFetchers) => Promise<void>;

/**
 * A script to run to set up part of a repository's tooling.
 * Can be a rich object with multiple commands, or a single command string.
 */
export type CreatedScript = CreatedScriptWithOptions | string;

/**
 * Commands to run to set up part of a repository's tooling.
 */
export interface CreatedScriptWithOptions {
	commands: string[];
	phase?: number;
	silent?: boolean;
}

/**
 * In-memory representation of a repository.
 * Creations are returned by template `produce()` functions to describe how to create a repository.
 * @see https://www.create.bingo/build/concepts/creations
 */
export interface Creation {
	/**
	 * Files to write to disk.
	 */
	files: CreatedDirectory;

	/**
	 * Network requests to send to initialize repository API settings.
	 */
	requests: CreatedRequest[];

	/**
	 * Scripts to run after writing files to disk.
	 */
	scripts: CreatedScript[];

	/**
	 * Suggestions to hint in the CLI after running.
	 */
	suggestions: string[];
}
