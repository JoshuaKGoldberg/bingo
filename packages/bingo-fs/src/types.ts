export interface CreatedDirectory {
	[i: string]: CreatedFileEntry | undefined;
}

export type CreatedFileEntry =
	| [string, CreatedFileOptions]
	| [string]
	| CreatedDirectory
	| false
	| string;

export interface CreatedFileOptions {
	/**
	 * Whether to set executable permissions (e.g. 0x755) instead of non-executable (e.g. 0x644).
	 */
	executable?: boolean;
}
