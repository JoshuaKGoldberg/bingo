import { withoutUndefinedProperties } from "without-undefined-properties";

export type AwaitedLazyProperties<T> = {
	[K in keyof T]: AwaitedLazyProperty<T[K]>;
};

export type AwaitedLazyProperty<T> = T extends () => infer R ? Awaited<R> : T;

// TODO: move into separate package?
export async function awaitLazyProperties<T extends object>(
	source: T,
): Promise<AwaitedLazyProperties<T>> {
	const result: Record<string, unknown> = {};
	const tasks: Promise<void>[] = [];

	for (const [key, creator] of Object.entries(source)) {
		if (typeof creator !== "function") {
			result[key] = creator;
			continue;
		}

		const task = (creator as () => unknown)();

		if (task instanceof Promise) {
			tasks.push(
				task.then((awaited) => {
					result[key] = awaited;
				}),
			);
		} else if (task !== undefined) {
			result[key] = task;
		}
	}

	await Promise.all(tasks);

	return withoutUndefinedProperties(result) as AwaitedLazyProperties<T>;
}
