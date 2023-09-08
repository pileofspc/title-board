import type { Directive } from "nuxt/dist/app/compat/capi";

const listeners: Map<HTMLElement, EventListener> = new Map();

export default defineNuxtPlugin((nuxtApp) => {
    const outside: Directive<HTMLElement, EventListener> = {
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
    };

    const focus: Directive<HTMLElement, EventListener> = {
        mounted(el) {
            el.focus();
        },
    };

    nuxtApp.vueApp.directive("outside", outside);
    nuxtApp.vueApp.directive("focus", focus);
});
