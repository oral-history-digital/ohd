import { RTL_LANGUAGES } from 'modules/constants';

/**
 * Checks if a locale code represents an RTL (right-to-left) language.
 * @param {string} locale - ISO 639-3 language code
 * @returns {boolean} true if the language is RTL
 */
export function isRtlLanguage(locale) {
    return RTL_LANGUAGES.includes(locale);
}
