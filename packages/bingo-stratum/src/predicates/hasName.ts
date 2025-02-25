import { AboutBase, AboutBaseWithName } from "bingo";

export interface HasAbout {
	about: AboutBase;
}

export interface HasAboutWithName {
	about: AboutBaseWithName;
}

export function hasName<T extends Partial<HasAbout>>(
	value: T,
): value is HasAboutWithName & T {
	return !!value.about?.name;
}
