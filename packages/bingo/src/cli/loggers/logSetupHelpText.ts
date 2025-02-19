import { AnyShape } from "../../options.js";
import { Template } from "../../types/templates.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { logHelpText } from "./logHelpText.js";
import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

export function logSetupHelpText<OptionsShape extends AnyShape = AnyShape>(
	from: string,
	template: Template<OptionsShape>,
): ModeResults {
	logHelpText("setup", from);

	logSchemasHelpOptions(template.about?.name ?? from, template.options);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
