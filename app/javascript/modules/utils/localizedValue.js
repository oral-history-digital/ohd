/**
 * Returns the best localized primitive value for the requested locale.
 */
export default function localizedValue(
    value,
    locale,
    { emptyValue = null, fallbackLocales = ['de', 'en'] } = {}
) {
    if (value === null || value === undefined) {
        return emptyValue;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    if (typeof value !== 'object') {
        return emptyValue;
    }

    const toUsablePrimitive = (entry) => {
        if (entry === null || entry === undefined || entry === '') {
            return undefined;
        }

        if (typeof entry === 'string' || typeof entry === 'number') {
            return String(entry);
        }

        return undefined;
    };

    const readLocaleValue = (key) => {
        if (!key) {
            return undefined;
        }

        return toUsablePrimitive(value[key]);
    };

    // First try the requested locale, then fallbacks, then any primitive value in the object.
    const byLocale = readLocaleValue(locale);
    if (byLocale !== undefined) {
        return byLocale;
    }

    for (const fallbackLocale of fallbackLocales) {
        const fallbackValue = readLocaleValue(fallbackLocale);
        if (fallbackValue !== undefined) {
            return fallbackValue;
        }
    }

    // Last-resort fallback for objects that contain usable values under unknown keys.
    const firstPrimitive = Object.values(value)
        .map(toUsablePrimitive)
        .find((entry) => entry !== undefined);

    return firstPrimitive !== undefined ? firstPrimitive : emptyValue;
}
