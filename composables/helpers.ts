export function timeout<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
) {
    let timer: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
export function blobToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
    });
}
export function def(value: unknown) {
    return value !== undefined && value !== null;
}
export function clamp(min: number, val: number, max: number) {
    return Math.max(Math.min(val, max), min);
}
