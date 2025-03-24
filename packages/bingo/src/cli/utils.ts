import { fileURLToPath } from "node:url";

export function makeRelative(item: string) {
	return item.startsWith(".") ? item : `./${item}`;
}

export function resolveFilePath(filePath: string) {
	return fileURLToPath(new URL(filePath, "file://"));
}
