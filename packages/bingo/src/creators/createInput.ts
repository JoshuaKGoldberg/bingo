import { z } from "zod";

import { AnyShapesArray, InferredValues } from "../options.js";
import {
	Input,
	InputContext,
	InputContextWithArgs,
	InputProducerWithArgs,
	InputProducerWithoutArgs,
	InputWithArgs,
	InputWithoutArgs,
} from "../types/inputs.js";
import { isDefinitionWithArgs } from "./utils.js";

export type InputDefinition<
	Result,
	ArgsShapes extends AnyShapesArray | undefined,
> = ArgsShapes extends object
	? InputDefinitionWithArgs<Result, ArgsShapes>
	: InputDefinitionWithoutArgs<Result>;

export interface InputDefinitionWithArgs<
	Result,
	ArgsShapes extends AnyShapesArray,
> {
	args: ArgsShapes;
	produce: InputProducerWithArgs<Result, InferredValues<ArgsShapes>>;
}

export interface InputDefinitionWithoutArgs<Result> {
	produce: InputProducerWithoutArgs<Result>;
}

export function createInput<
	Result,
	const ArgsShapes extends AnyShapesArray | undefined = undefined,
>(
	inputDefinition: InputDefinition<Result, ArgsShapes>,
): Input<Result, ArgsShapes> {
	return (
		isDefinitionWithArgs(inputDefinition)
			? createInputWithArgs(inputDefinition)
			: createInputWithoutArgs(inputDefinition)
	) as Input<Result, ArgsShapes>;
}

function createInputWithArgs<Result, const ArgsShapes extends AnyShapesArray>(
	inputDefinition: InputDefinitionWithArgs<Result, ArgsShapes>,
): InputWithArgs<Result, ArgsShapes> {
	const argsShape = z.tuple(inputDefinition.args);

	function input(context: InputContextWithArgs<InferredValues<ArgsShapes>>) {
		const args: InferredValues<ArgsShapes> = argsShape.parse(context.args);

		const givenContext = {
			...context,
			args,
		};

		const result = inputDefinition.produce(givenContext);

		return result;
	}

	input.args = inputDefinition.args;

	return input as InputWithArgs<Result, ArgsShapes>;
}

function createInputWithoutArgs<Result>(
	inputDefinition: InputDefinitionWithoutArgs<Result>,
): InputWithoutArgs<Result> {
	return ((context: InputContext) => {
		// TODO (once above is fixed)
		return inputDefinition.produce(context);
	}) as InputWithoutArgs<Result>;
}
