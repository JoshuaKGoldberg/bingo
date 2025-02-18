import { TakeInput } from "bingo";
import { SystemFetchers, SystemRunner, WritingFileSystem } from "bingo-systems";

export type Fetch = typeof fetch;

export interface MockSystemOptions {
	fetchers?: SystemFetchers;
	fs?: Partial<WritingFileSystem>;
	runner?: SystemRunner;
	take?: TakeInput;
}
