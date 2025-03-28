export function makeRelative(item: string) {
	return item.startsWith(".") ? item : `./${item}`;
}
