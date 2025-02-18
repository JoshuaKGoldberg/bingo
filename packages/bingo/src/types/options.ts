import { TakeInput } from "./inputs.js";

export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

export interface OptionsContext<Options extends object> {
	offline?: boolean;
	options: Partial<Options>;
	take: TakeInput;
}
