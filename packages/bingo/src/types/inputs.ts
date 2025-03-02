import { ReadingFileSystem, SystemFetchers, SystemRunner } from "bingo-systems";

import { AnyShape, InferredObject } from "../options.js";

export type Input<
	Result,
	ArgsShape extends AnyShape | undefined = undefined,
> = ArgsShape extends AnyShape
	? InputWithArgs<Result, ArgsShape>
	: InputWithoutArgs<Result>;

export type InputContext<Args extends object | undefined> = Args extends object
	? InputContextWithArgs<Args>
	: InputContextWithoutArgs;

export interface InputContextWithArgs<Args extends object>
	extends InputContextWithoutArgs {
	args: Args;
}

export interface InputContextWithoutArgs extends InputSystem {
	offline?: boolean;
	take: TakeInput;
}

export type InputProducerWithArgs<Result, ArgsSchema extends AnyShape> = (
	context: InputContextWithArgs<InferredObject<ArgsSchema>>,
) => Result;

export type InputProducerWithoutArgs<Result> = (
	context: InputContextWithoutArgs,
) => Result;

export interface InputSystem {
	fetchers: SystemFetchers;
	fs: ReadingFileSystem;
	runner: SystemRunner;
}

export interface InputThenable<Result> extends PromiseLike<Result> {
	(): Result;
}

export interface InputWithArgs<Result, ArgsSchema extends AnyShape> {
	(context: InputContextWithArgs<InferredObject<ArgsSchema>>): Result;
	args: ArgsSchema;
}

export type InputWithoutArgs<Result> = (
	context: InputContextWithoutArgs,
) => Result;

export interface TakeInput {
	<Result, ArgsShape extends AnyShape>(
		input: InputWithArgs<Result, ArgsShape>,
		args: InferredObject<ArgsShape>,
	): InputThenable<Result>;
	<Result>(input: InputWithoutArgs<Result>): InputThenable<Result>;
}
