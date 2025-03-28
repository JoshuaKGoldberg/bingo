#!/usr/bin/env node

import chalk from "chalk";

console.log(
	[
		chalk.red("❌ You just ran "),
		chalk.bold.red(`npx create`),
		chalk.red(", which installs and run this npm package named 'create'."),
	].join(""),
);

console.log(
	[
		chalk.yellow("You likely want "),
		chalk.bold.yellow(`npm create`),
		chalk.yellow(
			", the built-in npm command to install and run a package with a name like 'create-*'.",
		),
	].join(""),
);

console.log(chalk.yellow("See: https://docs.npmjs.com/cli/commands/npm-init"));
