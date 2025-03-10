import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { packageData } from "../packageData.js";
import { AnyShape } from "../types/shapes.js";
import { Template } from "../types/templates.js";
import {
	DisplayPackageData,
	runInsideClackDisplay,
} from "./display/runInsideClackDisplay.js";
import { getTemplatePackageData } from "./getTemplatePackageData.js";
import { parseProcessArgv } from "./parseProcessArgv.js";
import { runCLI } from "./runCLI.js";
import { CLIStatus } from "./status.js";

/**
 * Runs an interactive CLI to generate and apply a template's output.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional template-specific customizations.
 * @see {@link https://create.bingo/build/apis/run-template-cli}
 */
export async function runTemplateCLI<
	OptionsShape extends AnyShape,
	Refinements,
>(
	template: Template<OptionsShape, Refinements>,
	providedTemplatePackageData?: DisplayPackageData,
) {
	const templatePackageData =
		providedTemplatePackageData ?? (await getTemplatePackageData());

	if (templatePackageData instanceof Error) {
		console.error(templatePackageData);
		return CLIStatus.Error;
	}

	const { argv, values } = parseProcessArgv();
	if (values.version) {
		console.log(`${packageData.name}@${packageData.version}`);
		console.log(`${templatePackageData.name}@${templatePackageData.version}`);
		return CLIStatus.Success;
	}

	return await runInsideClackDisplay(templatePackageData, async (display) => {
		if (template.about?.repository) {
			prompts.log.info(
				`Learn more on:\n  ${chalk.blue(`https://github.com/${template.about.repository.owner}/${template.about.repository.repository}`)}`,
			);
		}

		return await runCLI({
			argv,
			display,
			from: templatePackageData.name,
			template,
			values,
		});
	});
}
