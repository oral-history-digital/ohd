/**
 * Mock for i18n hook.
 * The t() function just returns the translation key in tests.
 */

export function useI18n() {
    return {
        locale: 'de',
        translations: {
            de: {},
            en: {},
        },
        t: (key) => key,
    };
}
