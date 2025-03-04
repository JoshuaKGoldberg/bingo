/**
 * Representation of a directory.
 */
export interface CreatedDirectory {
	[i: string]: CreatedEntry | undefined;
}

/**
 * Representation of a directory child, such as a directory or file.
 */
export type CreatedEntry = CreatedDirectory | CreatedFileEntry | false;

/**
 * Representation of a file with added metadata.
 */
export type CreatedFileEntryWithMetadata = [string, CreatedFileMetadata];

/**
 * Representation of a file, optionally with added metadata.
 */
export type CreatedFileEntry = [string] | CreatedFileEntryWithMetadata | string;

/**
 * Metadata attached to a {@link CreatedFileEntryWithMetadata}
 */
export interface CreatedFileMetadata {
	/**
	 * Whether to set executable permissions (e.g. 0x755) instead of non-executable (e.g. 0x644).
	 */
	executable?: boolean;
}

/**
 * Representation of a directory as read by the `intake` API.
 * This is the same as {@link `CreatedDirectory`} but with {@link IntakeEntry} as children instead of {@link CreatedEntry}.
 */
export interface IntakeDirectory {
	[i: string]: IntakeEntry | undefined;
}

/**
 * Representation of a directory child as read by the `intake` API.
 * This is the same as {@link `CreatedEntry`} but the tuple forms of files.
 */
export type IntakeEntry = IntakeDirectory | IntakeFileEntry;

/**
 * Representation of a directory as read by the `intake` API.
 * This is the same as {@link `CreatedFileEntry`} but with only the array forms.
 */
export type IntakeFileEntry = Exclude<CreatedFileEntry, string>;
