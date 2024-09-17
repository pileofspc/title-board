export function clamp(min: number, val: number, max: number) {
    return Math.max(Math.min(val, max), min);
}
export function timeout<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
) {
    let timer: Timer;
    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
export async function blobToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
    });
}
export function getCoords(elem: Element) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + window.scrollY,
        right: box.right + window.scrollX,
        bottom: box.bottom + window.scrollY,
        left: box.left + window.scrollX,
        width: box.width,
        height: box.height,
    };
}
export function withLoadingState(loading: Ref<boolean>) {
    return <T extends (...args: any[]) => Promise<any>>(fn: T) => {
        return async function decorated(...args: Parameters<T>) {
            loading.value = true;
            const awaited = await fn(...args);
            loading.value = false;
            return awaited as AwaitedFix<ReturnType<T>>;
        };
    };
}
