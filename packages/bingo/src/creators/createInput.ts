import { z } from "zod";

import { AnyShape, InferredObject } from "../options.js";
import {
	Input,
	InputContextWithArgs,
	InputContextWithoutArgs,
	InputProducerWithArgs,
	InputProducerWithoutArgs,
} from "../types/inputs.js";
import { isDefinitionWithArgs } from "./utils.js";

export type InputDefinition<
	Result,
	ArgsShape extends AnyShape | undefined = undefined,
> = ArgsShape extends object
	? InputDefinitionWithArgs<Result, ArgsShape>
	: InputDefinitionWithoutArgs<Result>;

export interface InputDefinitionWithArgs<Result, ArgsShape extends AnyShape> {
	args: ArgsShape;
	produce: InputProducerWithArgs<Result, ArgsShape>;
}

export interface InputDefinitionWithoutArgs<Result> {
	produce: InputProducerWithoutArgs<Result>;
}

export function createInput<
	Result,
	ArgsShape extends AnyShape | undefined = undefined,
>(
	inputDefinition: InputDefinition<Result, ArgsShape>,
): Input<Result, ArgsShape> {
	if (!isDefinitionWithArgs(inputDefinition)) {
		return ((context: InputContextWithoutArgs) => {
			return inputDefinition.produce(context);
		}) as Input<Result, ArgsShape>;
	}

	const argsShape = z.object(inputDefinition.args);

	function input(
		context: InputContextWithArgs<InferredObject<NonNullable<ArgsShape>>>,
	) {
		return inputDefinition.produce({
			...context,
			args: argsShape.parse(context.args),
		});
	}

	input.args = inputDefinition.args;

	return input as Input<Result, ArgsShape>;
}
