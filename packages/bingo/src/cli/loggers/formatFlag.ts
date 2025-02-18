import chalk from "chalk";

export function formatFlag(flag: string, type: string) {
	return [
		chalk.green("--"),
		chalk.bold.green(flag),
		" ",
		chalk.green(`(${type})`),
		chalk.blue(": "),
	].join("");
}
