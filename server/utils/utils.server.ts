function deepCopy<T extends Record<PropertyKey, any>>(target: T): DeepCopy<T> {
    return JSON.parse(JSON.stringify(target));
}

export async function handle<T>(promise: Promise<T>) {
    try {
        const data = await promise;
        return [data, null] as const;
    } catch (error) {
        console.warn(error);
        return [null, error] as const;
    }
}
