import slugify from "slugify";

export function slugifyName(original: string) {
	// @ts-expect-error -- https://github.com/simov/slugify/issues/196
	return slugify(original, { lower: true }) as string;
}
