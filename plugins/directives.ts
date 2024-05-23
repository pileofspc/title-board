const listeners: Map<HTMLElement, EventListener> = new Map();

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("outside", {
        mounted(el, binding) {
            const listener: EventListener = (e) => {
                if (el.contains(e.target as HTMLElement)) return;
                binding.value(e);
            };
            listeners.set(el, listener);
            // TODO: Разобраться почему не работает с событием click
            document.addEventListener("mousedown", listener);
        },
        unmounted(el) {
            document.removeEventListener("mousedown", listeners.get(el)!);
            listeners.delete(el);
        },
    });

    nuxtApp.vueApp.directive("focus", {
        mounted(el) {
            el.focus();
        },
    });
});
