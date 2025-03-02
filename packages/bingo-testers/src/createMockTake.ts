import { TakeInput } from "bingo";

export function createMockTake(getter: () => unknown): TakeInput {
	function take() {
		return getter();
	}

	take.then = async () => await getter();

	return take as TakeInput;
}
