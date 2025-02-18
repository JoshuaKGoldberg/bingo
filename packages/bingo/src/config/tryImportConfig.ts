import { tryImportWithPredicate } from "../cli/tryImportWithPredicate.js";
import { isCreatedConfig } from "../predicates/isCreatedConfig.js";

export async function tryImportConfig(configFile: string) {
	return await tryImportWithPredicate(
		async (moduleName) => (await import(moduleName)) as object,
		configFile,
		isCreatedConfig,
		"config from createConfig()",
	);
}
