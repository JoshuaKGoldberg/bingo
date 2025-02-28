import { BingoSystem } from "bingo-systems";

import { createSystemContext } from "../contexts/createSystemContext.js";
import { AnyShapesArray, InferredValues } from "../options.js";
import { Input } from "../types/inputs.js";

export interface RunInputSettings<Args extends object = object>
	extends Partial<BingoSystem> {
	args: Args;
	auth?: string;
	directory?: string;
	offline?: boolean;
}

export function runInput<Result, ArgsShape extends AnyShapesArray>(
	input: Input<Result, ArgsShape>,
	settings: RunInputSettings<InferredValues<ArgsShape>>,
) {
	const system = createSystemContext({
		directory: settings.directory ?? ".",
		...settings,
	});

	return input({
		args: settings.args,
		...system,
	});
}
