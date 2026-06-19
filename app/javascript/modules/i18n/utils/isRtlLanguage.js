import { ALPHA2_TO_ALPHA3, RTL_LANGUAGES } from 'modules/constants';

/**
 * Checks if a locale code represents an RTL (right-to-left) language.
 * @param {string} locale - ISO 639-2 or ISO 639-3 language code
 * @returns {boolean} true if the language is RTL
 */
export function isRtlLanguage(locale) {
    // Convert alpha-2 to alpha-3 if needed
    const alpha3Locale = ALPHA2_TO_ALPHA3[locale] || locale;
    return RTL_LANGUAGES.includes(alpha3Locale);
}
