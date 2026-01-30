import reactStringReplace from 'react-string-replace';

/**
 * Translates a key using the provided locale and translations object.
 *
 * IMPORTANT: Return type depends on parameters:
 * - With params: Returns an ARRAY (because reactStringReplace returns arrays)
 *   The array contains interleaved strings and values (can be strings or React elements)
 * - Without params: Returns a STRING
 *
 * Callers must check Array.isArray() before concatenating or processing the result.
 * When rendering as JSX, arrays are valid as children and will render the strings
 * and React elements in order.
 *
 * @param {Object} context - Translation context
 * @param {string} context.locale - Current locale (e.g., 'en', 'de')
 * @param {Object} context.translations - Translations object keyed by translation key
 * @param {boolean} context.translationsView - If true, appends the translation key to the result
 * @param {string} key - Translation key (e.g., 'labels.name')
 * @param {Object} [params] - Parameters to substitute in the translation string.
 *                           Placeholders use %{key} syntax (e.g., "Hello %{name}")
 *                           Values can be strings or React elements
 * @returns {string|Array} - String if no params, Array if params provided
 *                          (array contains interleaved strings and parameter values)
 */
export default function t(
    { locale, translations, translationsView },
    key,
    params
) {
    const translation = translations[key]?.[locale];
    const defaultTranslation = translations[defaultKey(key)]?.[locale];

    // Fallback chain: specific translation → default translation → key name
    let text = translation || defaultTranslation || productionFallback(key);

    // Substitute parameters into the translation string.
    // reactStringReplace returns an array of interleaved strings and substituted values,
    // or an original string if no substitutions were made.
    if (params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, () => value);
        }
    }

    const usedKey = !translation && defaultTranslation ? defaultKey(key) : key;

    // In development, optionally append the translation key for debugging incomplete translations
    if (translationsView) {
        Array.isArray(text)
            ? text.push(` (${usedKey})`)
            : (text += ` (${usedKey})`);
    }

    return text;
}

function defaultKey(key) {
    const keyArray = key.split('.');

    if (keyArray.length <= 2) {
        return undefined;
    }

    keyArray[keyArray.length - 2] = 'default';
    return keyArray.join('.');
}

function productionFallback(key) {
    const keyArray = key.split('.');
    return keyArray[keyArray.length - 1];
}
