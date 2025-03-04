/**
 * Reads the names of a directory's children.
 * @param directoryPath Path to the directory on disk.
 * @returns Promise for the names of the directory's children.
 */
export type ReadDirectory = (directoryPath: string) => Promise<string[]>;

/**
 * Reads the contents of a file.
 * @param filePath Path to the file on disk.
 * @returns Promise for the text contents of the file.
 */
export type ReadFile = (filePath: string) => Promise<string>;

/**
 * APIs to read from a file system.
 */
export interface ReadingFileSystem {
	/**
	 * Reads the names of a directory's children.
	 */
	readDirectory: ReadDirectory;

	/**
	 * Reads the contents of a file.
	 */
	readFile: ReadFile;
}

/**
 * Creates a directory if it doesn't yet exist.
 * @param directoryPath Path to the directory on disk.
 */
export type WriteDirectory = (directoryPath: string) => Promise<void>;

/**
 * Writes contents to a file, updating it if it already exists.
 * @param filePath Path to the file on disk.
 * @param contents New contents for the file.
 * @param options Extra metadata to attach to the file.
 * @returns Promise for the text contents of the file.
 */
export type WriteFile = (
	filePath: string,
	contents: string,
	options?: WriteFileOptions,
) => Promise<void>;

/**
 * Extra metadata for writing a file.
 */
export interface WriteFileOptions {
	/**
	 * Whether the file has an executable bit enabled.
	 */
	executable?: boolean;
}

/**
 * APIs to read from and write to a file system.
 */
export interface WritingFileSystem extends ReadingFileSystem {
	/**
	 * Creates a directory if it doesn't yet exist.
	 */
	writeDirectory: WriteDirectory;

	/**
	 * Writes contents to a file, updating it if it already exists.
	 */
	writeFile: WriteFile;
}
