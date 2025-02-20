import { isTemplate } from "../../predicates/isTemplate.js";
import { tryImportWithPredicate } from "../tryImportWithPredicate.js";
import { tryImport } from "./tryImport.js";

export async function tryImportTemplate(from: string) {
	return await tryImportWithPredicate(
		async () => await tryImport(from),
		from,
		isTemplate,
		"Template",
	);
}
