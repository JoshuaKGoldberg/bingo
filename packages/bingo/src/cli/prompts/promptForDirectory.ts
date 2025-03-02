import * as prompts from "@clack/prompts";
import * as fs from "node:fs/promises";
import slugify from "slugify";

import { AnyShape } from "../../options.js";
import { Template } from "../../types/templates.js";
import { validateNewDirectory } from "./validators.js";

export interface PromptForDirectorySettings<
	OptionsShape extends AnyShape = AnyShape,
> {
	requestedDirectory?: string;
	requestedRepository?: string;
	template: Template<OptionsShape>;
}

export async function promptForDirectory<
	OptionsShape extends AnyShape = AnyShape,
>({
	requestedRepository,
	requestedDirectory = requestedRepository,
	template,
}: PromptForDirectorySettings<OptionsShape>) {
	if (requestedDirectory) {
		if (validateNewDirectory(requestedDirectory)) {
			prompts.log.warn(`The '${requestedDirectory}' directory already exists.`);
		} else {
			await fs.mkdir(requestedDirectory, { recursive: true });
			return requestedDirectory;
		}
	}

	const directory = await prompts.text({
		initialValue:
			template.about?.name &&
			// @ts-expect-error -- https://github.com/simov/slugify/issues/196
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`my-${slugify(template.about.name.replace(/^create[^a-z]+/i, ""), { lower: true })}`,
		message:
			"What will the directory and name of the repository be? (--directory)",
		validate: validateNewDirectory,
	});

	if (!prompts.isCancel(directory)) {
		await fs.mkdir(directory, { recursive: true });
	}

	return directory;
}
