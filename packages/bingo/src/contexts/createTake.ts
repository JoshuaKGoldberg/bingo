import hashObject from "hash-object";

import { AnyShape, InferredObject } from "../options.js";
import { InputSystem, InputWithArgs, TakeInput } from "../types/inputs.js";

export function createTake(system: InputSystem): TakeInput {
	const cache = new Map<string, () => unknown>();

	const take = (<Result, ArgsShape extends AnyShape>(
		input: InputWithArgs<Result, ArgsShape>,
		args: InferredObject<ArgsShape>,
	) => {
		const hash = hashObject({ args, input });

		if (cache.has(hash)) {
			return cache.get(hash);
		}

		let result: [Result] | undefined;

		function getter() {
			result ??= [
				input({
					...system,
					args,
					take,
				}),
			];
			return result[0];
		}

		getter.then = async () => await getter();

		cache.set(hash, getter);

		return getter;
	}) as TakeInput;

	return take;
}
