import { CreatedDirectory } from "bingo-fs";

import { AboutBase } from "./about.js";
import { Creation } from "./creations.js";
import { TakeInput } from "./inputs.js";
import { LazyOptionalOptions } from "./options.js";
import { AnyShape, InferredObject } from "./shapes.js";

/**
 * Logs a message to the running user.
 */
export type ContextLog = (message: string) => void;

/**
 * Either a value or a Promise for the value.
 */
export type PromiseOrSync<T> = Promise<T> | T;

/**
 * Description of where to find a repository on GitHub.
 */
export interface RepositoryLocator {
	/**
	 * Organization or user account the repository is under.
	 */
	owner: string;

	/**
	 * Repository name within its owner.
	 */
	repository: string;
}

/**
 * Description of how to setup or transition a repository given a set of options.
 * @template OptionsShape Schemas of options the template takes in.
 * @see {@link https://create.bingo/build/concepts/templates}
 */
export interface Template<OptionsShape extends AnyShape = AnyShape>
	extends TemplateDefinition<OptionsShape> {
	/**
	 * Schemas of options the template takes in.
	 */
	options: OptionsShape;
}

/**
 * About information for a template, including an optional repository locator.
 */
export interface TemplateAbout extends AboutBase {
	/**
	 * GitHub repository locator, if this is attached to a template repository.
	 */
	repository?: RepositoryLocator;
}

/**
 * Context provided to template producers.
 * @template Options Options values as described by the template's options schema.
 * @see {@link http://create.bingo/build/details/contexts#template-contexts}
 */
export interface TemplateContext<Options extends object> {
	/**
	 * Options values as described by the template's options schema.
	 */
	options: Options;
}

/**
 * Definition for creating a new Template.
 * @template OptionsShape Schemas of options the template takes in.
 * @see {@link https://www.create.bingo/build/apis/create-template}
 */
export interface TemplateDefinition<OptionsShape extends AnyShape = AnyShape> {
	/**
	 * About information for the template, including an optional repository locator.
	 * @see {@link https://www.create.bingo/build/apis/create-template#about}
	 */
	about?: TemplateAbout;

	/**
	 * Schemas of options the template takes in.
	 * @see {@link https://www.create.bingo/build/apis/create-template#options}
	 */
	options?: OptionsShape;

	/**
	 * Sets up lazily load default options values.
	 * @see {@link https://www.create.bingo/build/apis/create-template#prepare}
	 */
	prepare?: TemplatePrepare<InferredObject<OptionsShape>>;

	/**
	 * Generates the creations describing a repository made from the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#produce}
	 */
	produce: TemplateProduce<InferredObject<OptionsShape>>;

	/**
	 * Additional production function for initializing a new repository with the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#setup}
	 */
	setup?: TemplateProduce<InferredObject<OptionsShape>>;

	/**
	 * Additional production function for migrating an existing repository to the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#transition}
	 */
	transition?: TemplateProduce<InferredObject<OptionsShape>>;
}

/**
 * Sets up lazily loaded default options values.
 * @param context Shared helper functions and information.
 * @see {@link https://www.create.bingo/build/apis/create-template#prepare}
 */
export type TemplatePrepare<Options extends object> = (
	context: TemplatePrepareContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

/**
 * Shared helper functions and information passed to template options preparers.
 * @param context Shared helper functions and information.
 * @see {@link https://www.create.bingo/build/details/contexts#options-contexts}
 */
export interface TemplatePrepareContext<Options extends object>
	extends TemplateContext<Options> {
	/**
	 * Logs a message to the running user.
	 */
	log: ContextLog;

	/**
	 * Existing directory of files on disk, if available.
	 */
	files?: CreatedDirectory;

	/**
	 * Runs an Input.
	 */
	take: TakeInput;
}

/**
 * Generates the creations describing a repository made from the template.
 * @param context Shared helper functions and information.
 * @see {@link https://www.create.bingo/build/apis/create-template#produce}
 */
export type TemplateProduce<Options extends object> = (
	context: TemplateContext<Options>,
) => PromiseOrSync<Partial<Creation>>;
