import { AnyShape } from "bingo";

import { BaseDefinition } from "../types/bases.js";

export function assertNoPresetOption<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
) {
	// https://github.com/typescript-eslint/typescript-eslint/issues/6632
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (baseDefinition.options.preset) {
		throw new Error(`Bases should not declare a preset option.`);
	}
}
