import { z } from "zod";

export type AnyOptionalShape = Record<
	string,
	z.ZodDefault<z.ZodType> | z.ZodOptional<z.ZodType>
>;

export type AnyShape = z.ZodRawShape;

export type InferredObject<OptionsShape extends AnyShape | undefined> =
	OptionsShape extends AnyShape
		? z.infer<z.ZodObject<OptionsShape>>
		: undefined;

export type MinimumOptionsShape = AnyOptionalShape & RequiredOptionsShape;

export interface RequiredOptions {
	owner: string;
	repository: string;
}

export interface RequiredOptionsShape {
	owner: z.ZodOptional<z.ZodString>;
	repository: z.ZodOptional<z.ZodString>;
}
