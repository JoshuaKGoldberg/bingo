import { tryImportConfig } from "./tryImportConfig.js";

export async function tryImportConfigTemplate(configFile: string) {
	const config = await tryImportConfig(configFile);

	return config instanceof Error ? config : config.template;
}
