import { withoutUndefinedProperties } from "without-undefined-properties";

import { Creation } from "../types/creations.js";
import { applyMerger } from "./applyMerger.js";
import { mergeCreatedDirectories } from "./mergeCreatedDirectories.js";
import { mergeRequests } from "./mergeRequests.js";
import { mergeScripts } from "./mergeScripts.js";
import { mergeSuggestions } from "./mergeSuggestions.js";

export function mergeCreations<
	First extends Partial<Creation>,
	Second extends Partial<Creation>,
>(first: First, second: Second): First & Second {
	return withoutUndefinedProperties({
		files: applyMerger(first.files, second.files, mergeCreatedDirectories),
		requests: applyMerger(first.requests, second.requests, mergeRequests),
		scripts: applyMerger(first.scripts, second.scripts, mergeScripts),
		suggestions: applyMerger(
			first.suggestions,
			second.suggestions,
			mergeSuggestions,
		),
	}) as First & Second;
}
