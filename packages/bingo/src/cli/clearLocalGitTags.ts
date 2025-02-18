import { SystemRunner } from "bingo-systems";

export async function clearLocalGitTags(runner: SystemRunner) {
	const tags = await runner("git tag -l");

	if (tags.stdout) {
		await runner(`git tag -d ${tags.stdout.toString().replaceAll("\n", " ")}`);
	}
}
