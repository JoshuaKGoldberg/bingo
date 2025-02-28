import { ReadingFileSystem, SystemFetchers, SystemRunner } from "bingo-systems";

import { AnyShapesArray, InferredValues } from "../options.js";

export type Input<
	Result,
	ArgsShape extends AnyShapesArray | undefined,
> = ArgsShape extends object
	? InputWithArgs<Result, ArgsShape>
	: InputWithoutArgs<Result>;

export interface InputContext {
	fetchers: SystemFetchers;
	fs: ReadingFileSystem;
	offline?: boolean;
	runner: SystemRunner;
	take: TakeInput;
}

export interface InputContextWithArgs<Args extends object>
	extends InputContext {
	args: Args;
}

export type InputProducerWithArgs<Result, Args extends unknown[]> = (
	context: InputContextWithArgs<Args>,
) => Result;

export type InputProducerWithoutArgs<Result> = (
	context: InputContext,
) => Result;

export interface InputWithArgs<Result, ArgsSchema extends AnyShapesArray> {
	(context: InputContextWithArgs<InferredValues<ArgsSchema>>): Result;
	args: ArgsSchema;
}

export type InputWithoutArgs<Result> = (context: InputContext) => Result;

export interface TakeInput {
	<Result, ArgsShape extends AnyShapesArray>(
		input: InputWithArgs<Result, ArgsShape>,
		...args: InferredValues<ArgsShape>
	): Result;
	<Result>(input: InputWithoutArgs<Result>): Result;
}
