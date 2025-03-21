import { getCallId } from "call-id";
import path from "path";
import { readPackageUp } from "read-package-up";

import { resolveFilePath } from "./utils.js";

export async function getTemplatePackageData() {
	const callId = getCallId(2);

	if (!callId) {
		return new Error(
			"Could not determine what directory this Bingo CLI is being called from.",
		);
	}

	const directory = path.dirname(resolveFilePath(callId.file));
	const result = await readPackageUp({ cwd: directory });

	return (
		result?.packageJson ??
		new Error(`Could not find a package.json relative to '${directory}'.`)
	);
}
