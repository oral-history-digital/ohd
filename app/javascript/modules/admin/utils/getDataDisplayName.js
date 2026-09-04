import { localizedValue } from 'modules/utils';

/**
 * Returns a display name for a data object, based on its type and available fields.
 *
 * @param {Object} data - The data object to get the display name for.
 * @param {string} locale - The locale to use for localization.
 * @returns {string} The display name for the data object.
 *
 * Example:
 * const data = { type: 'Interview', title: { de: 'Geschichte' } };
 * const displayName = getDataDisplayName(data, 'de');
 * console.log(displayName); // Output: "Geschichte"
 *
 * Example:
 * const personData = {
 *   type: 'Person',
 *   name_type: 'Personal',
 *   first_name: { en: 'Ada' },
 *   last_name: { en: 'Lovelace' },
 * };
 * const personDisplayName = getDataDisplayName(personData, 'en');
 * console.log(personDisplayName); // Output: "Ada Lovelace"
 *
 * Example:
 * const dataWithName = { name: { de: 'Archiv' } };
 * const nameDisplayName = getDataDisplayName(dataWithName, 'de');
 * console.log(nameDisplayName); // Output: "Archiv"
 *
 * Example:
 * const dataWithCode = { code: { en: 'INT' } };
 * const codeDisplayName = getDataDisplayName(dataWithCode, 'en');
 * console.log(codeDisplayName);
 */
export function getDataDisplayName(data, locale) {
    const localizedText = (value) => {
        return localizedValue(value, locale, { emptyValue: undefined });
    };

    if (data.title && data.type !== 'Person') {
        return localizedText(data.title);
    }

    if (data.name_type === 'Personal' && data.first_name && data.last_name) {
        const firstName = localizedText(data.first_name);
        const lastName = localizedText(data.last_name);

        return `${firstName || ''} ${lastName || ''}`.trim();
    }

    if (data.name) {
        return localizedText(data.name);
    }

    return localizedText(data.code) || '';
}
