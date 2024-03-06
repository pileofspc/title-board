import type { H3Event, EventHandlerRequest } from "h3";

function deepCopy<T extends Record<PropertyKey, any>>(target: T): DeepCopy<T> {
    return JSON.parse(JSON.stringify(target));
}

export async function handleAsync<T>(
    promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
    try {
        const data = await promise;
        return [data, null] as const;
    } catch (error) {
        console.error(error);
        let resultError;
        // if (error instanceof Error) resultError = error
        return [
            null,
            error instanceof Error ? error : new Error(String(error)),
        ] as const;
    }
}

export function respondWithError(event: H3Event<EventHandlerRequest>) {
    setResponseStatus(event, 500, "Ошибка при обращении к базе данных");
}
