export function mergeSuggestions(first: string[], second: string[]): string[] {
	return Array.from(new Set([...first, ...second]));
}
