import { AnyShape, InferredObject, produceTemplate, Template } from "bingo";
import { BingoSystem } from "bingo-systems";

import { createMockSystems } from "./createMockSystems.js";

export interface TestProductionSettingsBase {
	system?: Omit<Partial<BingoSystem>, "take">;
}

export interface TestTemplateProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
}

export async function testTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: TestTemplateProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return await produceTemplate(template, { ...settings, ...system });
}
