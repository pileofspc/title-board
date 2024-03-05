export function filterNullable<T>(array: T[]): NonNullable<T>[] {
    return array.filter(
        (value): value is NonNullable<typeof value> =>
            value !== null && value !== undefined
    );
}
