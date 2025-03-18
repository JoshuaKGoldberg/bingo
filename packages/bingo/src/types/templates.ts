import { CreatedDirectory } from "bingo-fs";

import { AboutBase } from "./about.js";
import { CreateTemplateConfig } from "./configs.js";
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
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://create.bingo/build/concepts/templates}
 */
export interface Template<OptionsShape extends AnyShape, Refinements>
	extends TemplateDefinition<OptionsShape, Refinements> {
	/**
	 * Creates a configuration object to be default-exported from a config file.
	 * @see {@link https://www.create.bingo/configuration#createconfig}
	 */
	createConfig: CreateTemplateConfig<OptionsShape, Refinements>;

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
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link http://create.bingo/build/details/contexts#template-contexts}
 */
export interface TemplateContext<Options extends object, Refinements> {
	/**
	 * Options values as described by the template's options schema.
	 */
	options: Options;

	/**
	 * Any optional customizations from a template-specific config file.
	 */
	refinements?: Partial<Refinements>;
}

/**
 * Definition for creating a new Template.
 * @template OptionsShape Schemas of options the template takes in.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/create-template}
 */
export interface TemplateDefinition<
	OptionsShape extends AnyShape,
	Refinements,
> {
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
	prepare?: TemplatePrepare<InferredObject<OptionsShape>, Refinements>;

	/**
	 * Generates the creations describing a repository made from the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#produce}
	 */
	produce: TemplateProduce<InferredObject<OptionsShape>, Refinements>;

	/**
	 * Additional production function for initializing a new repository with the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#setup}
	 */
	setup?: TemplateProduce<InferredObject<OptionsShape>, Refinements>;

	/**
	 * Additional production function for migrating an existing repository to the template.
	 * @see {@link https://www.create.bingo/build/apis/create-template#transition}
	 */
	transition?: TemplateProduce<InferredObject<OptionsShape>, Refinements>;
}

/**
 * Sets up lazily loaded default options values.
 * @param context Shared helper functions and information.
 * @template Options Options values as described by the template's options schema.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/create-template#prepare}
 */
export type TemplatePrepare<Options extends object, Refinements> = (
	context: TemplatePrepareContext<Partial<Options>, Refinements>,
) => LazyOptionalOptions<Partial<Options>>;

/**
 * Shared helper functions and information passed to template options preparers.
 * @param context Shared helper functions and information.
 * @template Options Options values as described by the template's options schema.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/details/contexts#options-contexts}
 */
export interface TemplatePrepareContext<Options extends object, Refinements>
	extends TemplateContext<Options, Refinements> {
	/**
	 * Logs a message to the running user.
	 * @see {@link https://www.create.bingo/build/details/contexts#options-log}
	 */
	log: ContextLog;

	/**
	 * Existing directory of files on disk, if available.
	 * @see {@link https://www.create.bingo/build/details/contexts#options-files}
	 */
	files?: CreatedDirectory;

	/**
	 * Runs an Input.
	 * @see {@link https://www.create.bingo/build/details/contexts#options-take}
	 */
	take: TakeInput;
}

/**
 * Generates the creations describing a repository made from the template.
 * @param context Shared helper functions and information.
 * @template Options Options values as described by the template's options schema.
 * @template Refinements Any optional customizations from a template-specific config file.
 * @see {@link https://www.create.bingo/build/apis/create-template#produce}
 */
export type TemplateProduce<Options extends object, Refinements> = (
	context: TemplateContext<Options, Refinements>,
) => PromiseOrSync<Partial<Creation>>;
