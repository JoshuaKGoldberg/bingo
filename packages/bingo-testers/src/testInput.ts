import { AnyShape, InferredObject, Input, TakeInput } from "bingo";

import { createMockSystems } from "./createMockSystems.js";
import { MockSystemOptions } from "./types.js";

export interface InputContextSettingsWithArgs<Args extends object>
	extends InputContextSettingsWithoutArgs {
	args: Args;
}

export interface InputContextSettingsWithoutArgs extends MockSystemOptions {
	take?: TakeInput;
}

export function testInput<Result, ArgsShape extends AnyShape>(
	input: Input<Result, ArgsShape>,
	settings: Partial<
		InputContextSettingsWithArgs<InferredObject<ArgsShape>>
	> = {},
) {
	const { system, take } = createMockSystems(settings);

	return input({
		...(settings as InputContextSettingsWithArgs<InferredObject<ArgsShape>>),
		...system,
		take,
	});
}
