import { z } from "zod";

import {
	Input,
	InputContextWithArgs,
	InputContextWithoutArgs,
	InputProducerWithArgs,
	InputProducerWithoutArgs,
} from "../types/inputs.js";
import { AnyShape, InferredObject } from "../types/shapes.js";
import { isDefinitionWithArgs } from "./utils.js";

/**
 * Definition for creating a new Input that might have args defined.
 * @see {@link createInput}
 * @see {@link https://create.bingo/build/apis/create-input}
 */
export type InputDefinition<
	Result,
	ArgsShape extends AnyShape | undefined = undefined,
> = ArgsShape extends object
	? InputDefinitionWithArgs<Result, ArgsShape>
	: InputDefinitionWithoutArgs<Result>;

/**
 * Definition for creating a new Input that has args defined.
 * @see {@link createInput}
 * @see {@link https://create.bingo/build/apis/create-input}
 */
export interface InputDefinitionWithArgs<Result, ArgsShape extends AnyShape> {
	args: ArgsShape;
	produce: InputProducerWithArgs<Result, ArgsShape>;
}

/**
 * Definition for creating a new Input that does not have args defined.
 * @see {@link createInput}
 * @see {@link https://create.bingo/build/apis/create-input}
 */
export interface InputDefinitionWithoutArgs<Result> {
	produce: InputProducerWithoutArgs<Result>;
}

/**
 * Creates a new Input.
 * @see {@link https://create.bingo/build/apis/create-input}
 */
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
