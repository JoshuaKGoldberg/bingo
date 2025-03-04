import { BingoSystem } from "bingo-systems";

import { createSystemContext } from "../contexts/createSystemContext.js";
import { Input } from "../types/inputs.js";
import { AnyShape, InferredObject } from "../types/shapes.js";

export interface RunInputSettings<Args extends object = object>
	extends Partial<BingoSystem> {
	args: Args;
	auth?: string;
	directory?: string;
	offline?: boolean;
}

export function runInput<Result, ArgsShape extends AnyShape>(
	input: Input<Result, ArgsShape>,
	settings: RunInputSettings<InferredObject<ArgsShape>>,
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
