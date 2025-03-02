import Handlebars from "handlebars";

export function executeTemplate(source: string, options?: object) {
	return Handlebars.compile(source)(options);
}
