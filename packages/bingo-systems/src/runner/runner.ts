import { ExecaError, Result } from "execa";

/**
 * Executes a command in the system shell.
 * @see {@link https://github.com/sindresorhus/execa}
 */
export type SystemRunner = (command: string) => Promise<ExecaError | Result>;
