/**
 * Returns a locale-aware pluralized translation key suffix.
 *
 * @param {string} keyBase Translation key without plural category suffix.
 * @param {number} count Number used for plural selection.
 * @param {string} [locale='en'] Locale used by Intl.PluralRules.
 * @param {string[]} [availableCategories=['one', 'other']] Supported plural
 * categories for this key. Falls back to 'other' if category is unavailable.
 * @returns {string} Translation key with plural category suffix.
 *
 * @example
 * pluralizeKey('activerecord.models.project', 1)
 * // => 'activerecord.models.project.one'
 *
 * @example
 * pluralizeKey('activerecord.models.project', 2)
 * // => 'activerecord.models.project.other'
 */
export function pluralizeKey(
    keyBase,
    count,
    locale = 'en',
    availableCategories = ['one', 'other']
) {
    const category = new Intl.PluralRules(locale).select(count);
    const resolvedCategory = availableCategories.includes(category)
        ? category
        : 'other';

    return `${keyBase}.${resolvedCategory}`;
}

export default pluralizeKey;
