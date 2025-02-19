import { parseArgs, ParseArgsConfig } from "node:util";

type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;

export const cliArgsOptions = {
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

// TODO: Send issue/PR to DefinitelyTyped to export these from node:util...

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
	const args = process.argv.slice(2);
	return {
		args,
		...parseArgs({
			args,
			options: cliArgsOptions,
			strict: false,
		}),
	};
}
