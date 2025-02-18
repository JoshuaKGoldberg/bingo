import hostedGitInfo from "hosted-git-info";
import { readPackage } from "read-pkg";

import { RepositoryLocator } from "../../types/templates.js";

export async function getForkedRepositoryLocator(
	directory: string,
	repository: RepositoryLocator,
) {
	const packageData = await readPackage({ cwd: directory });
	if (!packageData.repository?.url) {
		return undefined;
	}

	const gitInfo = hostedGitInfo.fromUrl(packageData.repository.url);

	if (
		gitInfo?.user !== repository.owner ||
		gitInfo.project !== repository.repository
	) {
		return undefined;
	}

	return `${repository.owner}/${repository.repository}`;
}
