import { ReadingFileSystem, SystemFetchers, SystemRunner } from "bingo-systems";

import { AnyShape, InferredObject } from "../options.js";

export type Input<
	Result,
	ArgsShape extends AnyShape | undefined = undefined,
> = ArgsShape extends AnyShape
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

export type InputProducerWithArgs<Result, ArgsSchema extends AnyShape> = (
	context: InputContextWithArgs<InferredObject<ArgsSchema>>,
) => Result;

export type InputProducerWithoutArgs<Result> = (
	context: InputContext,
) => Result;

export interface InputWithArgs<Result, ArgsSchema extends AnyShape> {
	(context: InputContextWithArgs<InferredObject<ArgsSchema>>): Result;
	args: ArgsSchema;
}

export type InputWithoutArgs<Result> = (context: InputContext) => Result;

export interface TakeInput {
	<Result, ArgsShape extends AnyShape>(
		input: InputWithArgs<Result, ArgsShape>,
		args: InferredObject<ArgsShape>,
	): Result;
	<Result>(input: InputWithoutArgs<Result>): Result;
}
