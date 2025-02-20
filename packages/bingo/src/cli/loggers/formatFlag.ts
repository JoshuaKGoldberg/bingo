import chalk from "chalk";

export function formatFlag(flag: string, type: string) {
	return [
		flag.startsWith("--")
			? [chalk.green("--"), chalk.bold.green(flag.slice(2))].join("")
			: chalk.bold.green(flag),
		" ",
		chalk.green(`(${type})`),
		chalk.blue(": "),
	].join("");
}
