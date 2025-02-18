import { SystemRunner } from "bingo-systems";

export interface CreateInitialCommitSettings {
	amend?: boolean;
	offline?: boolean;
}

export async function createInitialCommit(
	runner: SystemRunner,
	{ amend, offline }: CreateInitialCommitSettings = {},
) {
	for (const command of [
		`git add -A`,
		`git commit --message feat:\\ initialized\\ repo\\ ✨ ${amend ? "--amend " : ""}--no-gpg-sign`,
		...(offline ? [] : [`git push -u origin main --force`]),
	]) {
		await runner(command);
	}
}
