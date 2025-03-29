import { getCallId } from "call-id";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readPackageUp } from "read-package-up";

export async function getTemplatePackageData() {
	const callId = getCallId(2);

	if (!callId) {
		return new Error(
			"Could not determine what directory this Bingo CLI is being called from.",
		);
	}

	const directoryUrl = new URL(path.dirname(callId.file), "file://");
	const result = await readPackageUp({ cwd: directoryUrl });

	return (
		result?.packageJson ??
		new Error(
			`Could not find a package.json relative to '${fileURLToPath(directoryUrl)}'.`,
		)
	);
}
