import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { logHelpText } from "./logHelpText.js";

export function logTransitionHelpText(from: string): ModeResults {
	logHelpText("transition", from);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
