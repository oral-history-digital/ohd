/**
 * Merges translation records from persisted data and current form values.
 *
 * Behavior:
 * - Accepts `translations_attributes` in either array or object form.
 * - Uses `locale` as unique key.
 * - Gives precedence to form values for the same locale.
 * - Ignores records without a locale.
 *
 * @param {Object} data - Persisted record payload
 * @param {Object} formValues - Live form state payload
 * @returns {Array<Object>} Locale-unique merged translations
 */
export function getMergedTranslations(data, formValues) {
    const persistedTranslations = Array.isArray(data?.translations_attributes)
        ? data.translations_attributes
        : Object.values(data?.translations_attributes || {});

    const formTranslations = Array.isArray(formValues?.translations_attributes)
        ? formValues.translations_attributes
        : Object.values(formValues?.translations_attributes || {});

    const byLocale = new Map();

    persistedTranslations.forEach((translation) => {
        if (translation?.locale) {
            byLocale.set(translation.locale, translation);
        }
    });

    formTranslations.forEach((translation) => {
        if (translation?.locale) {
            const existing = byLocale.get(translation.locale) || {};
            byLocale.set(translation.locale, {
                ...existing,
                ...translation,
            });
        }
    });

    return Array.from(byLocale.values());
}
