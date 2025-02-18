export async function tryCatchError<T>(promise: Promise<T>) {
	try {
		return await promise;
	} catch (error) {
		return error as Error;
	}
}

export async function tryCatchSafe<T>(promise: Promise<T>) {
	try {
		return await promise;
	} catch {
		return undefined;
	}
}
