import { CreatedDirectory } from "bingo-fs";
import { SystemFetchers } from "bingo-systems";

export interface CreatedRequest {
	id: string;
	send: CreatedRequestSender;
}

export type CreatedRequestSender = (fetchers: SystemFetchers) => Promise<void>;

export type CreatedScript = CreatedScriptWithOptions | string;

export interface CreatedScriptWithOptions {
	commands: string[];
	phase?: number;
	silent?: boolean;
}

export interface Creation {
	files: CreatedDirectory;
	requests: CreatedRequest[];
	scripts: CreatedScript[];
	suggestions: string[];
}
