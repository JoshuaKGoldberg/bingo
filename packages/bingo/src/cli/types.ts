import { CLIStatus } from "./status.js";

export type ModeResults = ModeResultsError | ModeResultsNonError;

export interface ModeResultsBase {
	outro?: string;
	suggestions?: string[];
}

export interface ModeResultsError extends ModeResultsBase {
	error?: Error;
	status: CLIStatus.Error;
}

export interface ModeResultsNonError extends ModeResultsBase {
	status: CLIStatus.Cancelled | CLIStatus.Success;
}

export type ProductionSettings =
	| ProductionSettingsSetup
	| ProductionSettingsTransition;

export interface ProductionSettingsSetup {
	mode: "setup";
}

export interface ProductionSettingsTransition {
	configFile?: string;
	mode: "transition";
}
