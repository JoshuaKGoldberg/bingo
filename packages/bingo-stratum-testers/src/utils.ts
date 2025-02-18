export function createFailingFunction(label: string, user: string) {
	return () => failingFunction(label, user);
}

export function createFailingObject(label: string, user: string) {
	return new Proxy(
		{},
		{
			get: createFailingFunction(label, user),
		},
	);
}

function failingFunction(label: string, user: string): never {
	throw new Error(
		`Context property '${label}' was used by ${user} but not provided.`,
	);
}
