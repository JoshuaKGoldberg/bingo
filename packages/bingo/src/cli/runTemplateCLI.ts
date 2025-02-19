import * as prompts from "@clack/prompts";
import { getCallId } from "call-id";
import path from "node:path";
import { readPackageUp } from "read-package-up";

import { AnyShape } from "../options.js";
import { packageData } from "../packageData.js";
import { Template } from "../types/templates.js";
import {
	DisplayPackageData,
	runInsideClackDisplay,
} from "./display/runInsideClackDisplay.js";
import { parseProcessArgv } from "./parseProcessArgv.js";
import { runCLI } from "./runCLI.js";
import { CLIStatus } from "./status.js";

export async function runTemplateCLI<OptionsShape extends AnyShape = AnyShape>(
	template: Template<OptionsShape>,
	providedTemplatePackageData?: DisplayPackageData,
) {
	const templatePackageData =
		providedTemplatePackageData ?? (await getTemplatePackageData());

	if (templatePackageData instanceof Error) {
		console.error(templatePackageData);
		return CLIStatus.Error;
	}

	const { args, values } = parseProcessArgv();
	if (values.version) {
		console.log(`${packageData.name}@${packageData.version}`);
		console.log(`${templatePackageData.name}@${templatePackageData.version}`);
		return CLIStatus.Success;
	}

	return await runInsideClackDisplay(templatePackageData, async (display) => {
		if (template.about?.repository) {
			prompts.log.info(
				`Learn more on:\n  https://github.com/${template.about.repository.owner}/${template.about.repository.repository}`,
			);
		}

		return await runCLI({
			args,
			display,
			from: templatePackageData.name,
			template,
			values,
		});
	});
}

async function getTemplatePackageData() {
	const callId = getCallId(2);

	if (!callId) {
		return new Error(
			"Could not determine what directory this Bingo CLI is being called from.",
		);
	}

	const directory = path.dirname(callId.file);
	const result = await readPackageUp({ cwd: directory });

	return (
		result?.packageJson ??
		new Error(`Could not find a package.json relative to '${directory}'.`)
	);
}
