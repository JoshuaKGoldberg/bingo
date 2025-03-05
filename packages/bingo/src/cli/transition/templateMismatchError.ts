import { AnyShape } from "../../types/shapes.js";
import { Template } from "../../types/templates.js";

const anonymousName = "(anonymous)";

export function templateMismatchError<
	OptionsShape extends AnyShape,
	Refinements,
>(
	fromConfig: Template<OptionsShape, Refinements>,
	running: Template<OptionsShape, Refinements>,
) {
	const fromConfigName = getTemplateName(fromConfig);
	const runningName = getTemplateName(running);

	if (fromConfigName !== runningName) {
		return new Error(
			`Config file template ${fromConfigName} is not the same as running template ${runningName}.`,
		);
	}

	if (fromConfigName === anonymousName) {
		return new Error(
			`Config file and running template are mismatched and do not have identifying names.`,
		);
	}

	return new Error(
		`Config file and running template have the same name, ${runningName}, but are not the same object. Are there multiple template versions?`,
	);
}

function getTemplateName<OptionsShape extends AnyShape, Refinements>(
	template: Template<OptionsShape, Refinements>,
) {
	return template.about?.name ?? anonymousName;
}
