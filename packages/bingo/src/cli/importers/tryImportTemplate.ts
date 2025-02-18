import { isTemplate } from "../../predicates/isTemplate.js";
import { tryImportWithPredicate } from "../tryImportWithPredicate.js";
import { tryImportAndInstallIfNecessary } from "./tryImportAndInstallIfNecessary.js";

export async function tryImportTemplate(
	from: string,
	yes: boolean | undefined,
) {
	return await tryImportWithPredicate(
		async () => tryImportAndInstallIfNecessary(from, yes),
		from,
		isTemplate,
		"Template",
	);
}
