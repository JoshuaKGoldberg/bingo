import * as fs from "node:fs/promises";

export async function clearTemplateFiles(directory: string) {
	const children = await fs.readdir(directory);

	await Promise.all(
		children
			.filter((child) => child !== ".git")
			.map(async (child) => {
				await fs.rm(child, { recursive: true });
			}),
	);
}
