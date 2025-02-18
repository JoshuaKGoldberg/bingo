import hashObject from "hash-object";

import { BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";

export function mergeAddons<Options extends object | unknown[]>(
	first: CreatedBlockAddons<object, Options>[],
	second: CreatedBlockAddons<object, Options>[],
): CreatedBlockAddons<object, Options>[] {
	const byBlock = new Map<
		BlockWithAddons<object, Options>,
		object | unknown[]
	>();

	for (const { addons, block } of [...first, ...second]) {
		const merged = mergeBlockAddons(byBlock.get(block), addons);

		if (isNotNullish(merged)) {
			byBlock.set(block, merged);
		}
	}

	return Array.from(byBlock).map(([block, addons]) => ({ addons, block }));
}

function isNotNullish(value: unknown) {
	return value != null;
}

function mergeBlockAddonArrays(firsts: unknown[], seconds: unknown[]) {
	const firstNonNullish = firsts.filter(isNotNullish);
	const secondNonNullish = seconds.filter(isNotNullish);

	return mergeBlockAddonArraysNonNullish(firstNonNullish, secondNonNullish);
}

function mergeBlockAddonArraysNonNullish(
	firsts: unknown[],
	seconds: unknown[],
) {
	const seen = new Set<unknown>();

	return [...firsts, ...seconds].filter((value) => {
		const identity =
			value && typeof value === "object" ? hashObject(value) : value;

		if (seen.has(identity)) {
			return false;
		}

		seen.add(identity);
		return true;
	});
}

function mergeBlockAddons(first: unknown, second: unknown) {
	if (Array.isArray(first) && Array.isArray(second)) {
		return mergeBlockAddonArrays(first, second);
	}

	return first ?? second;
}
