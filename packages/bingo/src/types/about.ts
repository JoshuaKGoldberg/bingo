export interface AboutBase {
	description?: string;
	name?: string;
}

export interface AboutBaseWithName extends AboutBase {
	name: string;
}
