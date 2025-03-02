import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Creation } from "./creations.js";
import { TakeInput } from "./inputs.js";
import { LazyOptionalOptions } from "./options.js";

export type PromiseOrSync<T> = Promise<T> | T;

export interface RepositoryLocator {
	owner: string;
	repository: string;
}

export interface Template<OptionsShape extends AnyShape = AnyShape>
	extends TemplateDefinition<OptionsShape> {
	options: OptionsShape;
}

export interface TemplateAbout extends AboutBase {
	repository?: RepositoryLocator;
}

export interface TemplateContext<Options extends object> {
	options: Options;
}

export interface TemplateDefinition<OptionsShape extends AnyShape = AnyShape> {
	about?: TemplateAbout;
	options?: OptionsShape;
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;
	produce: TemplateProduce<InferredObject<OptionsShape>>;
	setup?: TemplateProduce<InferredObject<OptionsShape>>;
	transition?: TemplateProduce<InferredObject<OptionsShape>>;
}

export type TemplatePrepare<Options extends object> = (
	context: TemplatePrepareContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

export interface TemplatePrepareContext<Options extends object>
	extends TemplateContext<Options> {
	take: TakeInput;
}

export type TemplateProduce<Options extends object> = (
	context: TemplateContext<Options>,
) => PromiseOrSync<Partial<Creation>>;
