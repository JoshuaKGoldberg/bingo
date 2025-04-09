import { tryImportWithPredicate } from "../cli/tryImportWithPredicate.js";
import { isTemplateConfig } from "../predicates/isTemplateConfig.js";

export async function tryImportConfig(configFile: string) {
	return await tryImportWithPredicate(
		async (moduleName) => (await import(moduleName)) as object,
		configFile,
		isTemplateConfig,
		"config from createConfig()",
	);
}
