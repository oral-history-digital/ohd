import isNil from 'lodash.isnil';

import { isDate } from './isDate';
import { toDateString } from './toDateString';

/**
 * Converts a model attribute value to a human-readable, localized string.
 *
 * Handles multiple value formats in order of precedence:
 * 1. Globalize translations_attributes (Rails Globalize gem)
 * 2. Direct localized objects ({ de: "...", en: "..." })
 * 3. Pass-through identifiers (archive_id, signature_original, shortname)
 * 4. Duration formatting (HH:MM:SS → "X h Y min")
 * 5. Date formatting (ISO8601 → locale-aware)
 * 6. Foreign key lookups (collection_id, *_language_id)
 * 7. Boolean translation keys
 * 8. Array values (comma-joined)
 * 9. TranslationValue system lookups (fallback)
 *
 * @param {Object} obj - Model object containing the attribute
 * @param {string} attribute - Attribute name to render
 * @param {string} locale - Target locale code (e.g., 'en', 'de')
 * @param {boolean} [collapsed=false] - Truncate long strings to 500 chars
 * @param {string} [none='---'] - Fallback for nil/missing values
 * @param {Object} [translations] - TranslationValue lookup (keyed by translation key)
 * @param {string} [optionsScope] - Scope override for translation lookup (e.g., 'registry_entry.gender')
 * @param {Object} [collections] - Collection lookup (keyed by ID)
 * @param {Object} [languages] - Language lookup (keyed by ID)
 *
 * @returns {string} Human-readable, localized representation
 *
 * @example
 * humanReadable({
 *   obj: { group: { de: "Dritte", en: "Third Person" } },
 *   attribute: 'group',
 *   locale: 'en',
 *   translations: {}
 * })
 * // => "Third Person"
 *
 * @example
 * humanReadable({
 *   obj: { gender: 'female' },
 *   attribute: 'gender',
 *   locale: 'de',
 *   optionsScope: 'registry_entry.gender',
 *   translations: { 'registry_entry.gender.female': { de: 'weiblich', en: 'female' } }
 * })
 * // => "weiblich"
 */
export function humanReadable({
    obj,
    attribute,
    collapsed = false,
    none = '---',
    translations,
    optionsScope,
    collections,
    languages,
    locale,
}) {
    // 1. Globalize translations_attributes (nested translations)
    if (obj.translations_attributes) {
        const translation = Array.isArray(obj.translations_attributes)
            ? obj.translations_attributes.find((t) => t.locale === locale)
            : Object.values(obj.translations_attributes).find(
                  (t) => t.locale === locale
              );
        const v = translation?.[attribute];
        if (v) return v;
    }

    let value = obj[attribute];

    // 2. Return fallback for nil/undefined values
    if (isNil(value)) {
        return none;
    }

    // 3. Pass-through identifiers (display as-is)
    if (['archive_id', 'signature_original', 'shortname'].includes(attribute)) {
        return value;
    }

    // 4. Duration formatting (HH:MM:SS → "X h Y min")
    if (attribute === 'duration') {
        return `${value.split(':')[0]} h ${value.split(':')[1]} min`;
    }

    // 5. Date formatting (locale-aware)
    if (isDate(value)) {
        return toDateString(value, locale);
    }

    // 6. Collection lookup by ID
    if (attribute === 'collection_id') {
        return collections[value]?.name[locale];
    }

    // 7. Language lookup by *_language_id
    if (/language_id$/.test(attribute)) {
        return languages[value]?.name[locale];
    }

    // 8. Boolean translation (boolean_value.true/false)
    if (typeof value === 'boolean') {
        return translations[`boolean_value.${value}`][locale];
    }

    // 9. Join array values with commas
    if (Array.isArray(value)) {
        return value.join(',');
    }

    // 10. Direct localized objects (e.g., { de: "Dritte", en: "Third Person" })
    // Note: Cached per-record; touch record or clear cache if stale
    if (typeof value === 'object' && value !== null) {
        return collapsed ? value[locale]?.substring(0, 500) : value[locale];
    }

    // 11. TranslationValue lookup (fallback for enum-like values)
    const keyParam = `${optionsScope || attribute}.${value}`;

    return (
        translations[keyParam]?.[locale] ||
        translations[value]?.[locale] ||
        value ||
        none
    );
}

export default humanReadable;
