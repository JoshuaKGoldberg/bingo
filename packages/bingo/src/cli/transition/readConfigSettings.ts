import path from "node:path";

import { tryImportConfig } from "../../config/tryImportConfig.js";
import { TemplateConfig } from "../../types/configs.js";
import { AnyShape } from "../../types/shapes.js";
import { Template } from "../../types/templates.js";
import { templateMismatchError } from "./templateMismatchError.js";

export async function readConfigSettings<
	OptionsShape extends AnyShape,
	Refinements,
>(
	configFile: string | undefined,
	directory: string,
	template: Template<OptionsShape, Refinements>,
) {
	if (!configFile) {
		return undefined;
	}

	const relativeConfigFile = path.join(process.cwd(), directory, configFile);
	const contents = (await tryImportConfig(relativeConfigFile)) as
		| Error
		| TemplateConfig<OptionsShape, Refinements>;

	if (contents instanceof Error) {
		return contents;
	}

	if (contents.template !== template) {
		return templateMismatchError(contents.template, template);
	}

	return contents;
}
