import {
	AnyShape,
	InferredObject,
	produceTemplate,
	SystemContext,
	Template,
} from "bingo";

import { createMockSystems } from "./createMockSystems.js";

export interface TestProductionSettingsBase {
	system?: Omit<Partial<SystemContext>, "take">;
}

export interface TestTemplateProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
}

export function testTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: TestTemplateProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return produceTemplate(template, { ...settings, ...system });
}
