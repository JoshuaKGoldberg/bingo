import { TakeInput } from "./inputs.js";

/**
 * Either a value, an async function, or a sync function to generate the value or undefined.
 */
export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

/**
 * "Lazy" version of an options shape: each property might be a lazy-loading function.
 */
export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

/**
 * Context provided to options preparation.
 * @see {@link http://create.bingo/build/apis/prepare-options}
 */
export interface OptionsContext<Options extends object> {
	/**
	 * Whether Bingo is being run in an "offline" mode.
	 * @see {@link http://create.bingo/build/details/contexts#options-offline}
	 */
	offline?: boolean;

	/**
	 * Any values explicitly provided by the user.
	 */
	options: Partial<Options>;

	/**
	 * Runs an Input.
	 * @see {@link http://create.bingo/build/details/contexts#input-take}
	 */
	take: TakeInput;
}
