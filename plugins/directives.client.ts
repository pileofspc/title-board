import type { Directive } from "nuxt/dist/app/compat/capi";

let listeners: Map<HTMLElement, EventListener> = new Map();

export default defineNuxtPlugin((nuxtApp) => {
    const outside: Directive<HTMLElement, EventListener> = {
        mounted(el, binding) {
            const listener: EventListener = (e: Event) => {
                if (!el.contains(e.target as HTMLElement)) {
                    binding.value(e);
                }
            };
            listeners.set(el, listener);
            // TODO: Разобраться почему не работает с событием click
            document.addEventListener("mousedown", listener);
        },
        beforeUnmount(el) {
            document.removeEventListener(
                "mousedown",
                listeners.get(el) as EventListener
            );
            listeners.delete(el);
        },
    };
    nuxtApp.vueApp.directive("outside", outside);
});
