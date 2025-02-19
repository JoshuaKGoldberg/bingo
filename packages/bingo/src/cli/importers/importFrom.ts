import enhancedResolve from "enhanced-resolve";

export async function importFrom(
	directory: string,
	packageName: string,
	importer: (main: string) => Promise<object>,
) {
	const main = await new Promise<Error | string>((resolve) => {
		enhancedResolve(directory, packageName, (error, result) => {
			resolve(error ?? (result as string));
		});
	});

	try {
		return typeof main === "string" ? await importer(main) : main;
	} catch (error) {
		return error as Error;
	}
}
