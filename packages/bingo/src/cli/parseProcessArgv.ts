import { parseArgs, ParseArgsConfig } from "node:util";

// TODO: Send issue/PR to DefinitelyTyped to export these from node:util...
// https://github.com/bingo-js/bingo/issues/284

type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;

const cliArgsOptions = {
	directory: {
		type: "string",
	},
	help: {
		type: "boolean",
	},
	mode: {
		type: "string",
	},
	offline: {
		type: "boolean",
	},
	owner: {
		type: "string",
	},
	repository: {
		type: "string",
	},
	version: {
		type: "boolean",
	},
} satisfies ParseArgsOptionsConfig;

export interface RunCLIRawValues {
	directory?: boolean | string | undefined;
	help?: boolean | string | undefined;
	mode?: boolean | string | undefined;
	offline?: boolean | string | undefined;
	owner?: boolean | string | undefined;
	repository?: boolean | string | undefined;
	version?: boolean | string | undefined;
}

export function parseProcessArgv() {
	return {
		argv: process.argv,
		...parseArgs({
			args: process.argv.slice(2),
			options: cliArgsOptions,
			strict: false,
		}),
	};
}
