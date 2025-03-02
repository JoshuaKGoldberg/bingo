import Handlebars from "handlebars";

export function executeTemplate(template: string, options?: object) {
	return Handlebars.compile(template)(options);
}
