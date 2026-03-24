/**
 * Returns a translated label and falls back to a provided fallback value.
 */
export function translateWithFallback(t, key, fallback) {
    const translated = t(key);
    return translated && translated !== key ? translated : fallback;
}

/**
 * Returns a localized string from string-or-locale-map values.
 */
export function getLocalizedValue(value, locale, defaultLocale) {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        return (
            value[locale] ||
            value[defaultLocale] ||
            Object.values(value).find((entry) => typeof entry === 'string') ||
            null
        );
    }

    return null;
}
