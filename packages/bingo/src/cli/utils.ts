import { fileURLToPath } from "node:url";

export function makeRelative(item: string) {
	return item.startsWith(".") ? item : `./${item}`;
}

export function resolveFilePath(filePath: string) {
	const fileUrl = filePath.startsWith("file://")
		? new URL(filePath)
		: new URL(filePath, "file://");

	return fileURLToPath(fileUrl);
}
