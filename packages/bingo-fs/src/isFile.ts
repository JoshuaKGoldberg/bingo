import { CreatedEntry } from "./types.js";

export function isFile(entry: CreatedEntry | undefined): entry is CreatedEntry {
	return typeof entry === "string" || Array.isArray(entry);
}
