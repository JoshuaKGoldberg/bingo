import { SystemRunner } from "bingo-systems";

export interface CreateInitialCommitSettings {
	amend?: boolean;
	push: boolean;
}

export async function createInitialCommit(
	runner: SystemRunner,
	{ amend, push }: CreateInitialCommitSettings,
) {
	for (const command of [
		`git add -A`,
		`git commit --message feat:\\ initialized\\ repo\\ ✨ ${amend ? "--amend " : ""}--no-gpg-sign`,
		...(push ? [`git push -u origin main --force`] : []),
	]) {
		await runner(command);
	}
}
