import { ExecaError, Result } from "execa";

export type SystemRunner = (command: string) => Promise<ExecaError | Result>;
