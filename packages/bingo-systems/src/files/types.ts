export interface DirectoryChild {
	name: string;
	type: "directory" | "file";
}

export type ReadDirectory = (filePath: string) => Promise<string[]>;

export type ReadFile = (filePath: string) => Promise<string>;

export interface ReadingFileSystem {
	readDirectory: ReadDirectory;
	readFile: ReadFile;
}

export type WriteDirectory = (directoryPath: string) => Promise<void>;

export type WriteFile = (
	filePath: string,
	contents: string,
	options?: WriteFileOptions,
) => Promise<void>;

export interface WriteFileOptions {
	executable?: boolean;
}

export interface WritingFileSystem extends ReadingFileSystem {
	writeDirectory: WriteDirectory;
	writeFile: WriteFile;
}
