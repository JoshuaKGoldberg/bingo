import { AnyShape, InferredObject } from "../options.js";
import { Template } from "../types/templates.js";

export interface CreatedConfig<
	OptionsShape extends AnyShape = AnyShape,
	Settings extends object = object,
> {
	options?: InferredObject<OptionsShape>;
	settings?: Settings;
	template: Template<OptionsShape>;
}
