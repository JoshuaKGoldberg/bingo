export interface ModeResults {
	outro?: string;
	status: number;
	suggestions?: string[];
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
