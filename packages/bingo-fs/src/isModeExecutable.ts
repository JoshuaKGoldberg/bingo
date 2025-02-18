export function isModeExecutable(mode: number) {
	return (mode & 0o1) !== 0;
}
