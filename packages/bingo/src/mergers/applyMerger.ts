export function applyMerger<T>(
	first: T | undefined,
	second: T | undefined,
	merger: (first: T, second: T) => T,
) {
	if (first == null || second == null) {
		return second ?? first ?? undefined;
	}

	return merger(first, second);
}
