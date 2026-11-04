import { localizedValue } from 'modules/utils';

/**
 * Returns a localized record label, keeping archive-logo type/locale labels and deriving media labels.
 * Uses available names, internal names, or URLs, then the supplied resource label and ID.
 *
 * @param {Object} data - The data object to get the display name for.
 * @param {string} locale - The locale to use for localization.
 * @param {Object} [options={}] - Resource context for type-specific labels and unnamed records.
 * @param {string} [options.scope] - Resource scope, such as logo or sponsor_logo.
 * @param {string} [options.resourceLabel=''] - Translated resource name supplied by the caller.
 * @returns {string} Display name, or an empty string when no usable label exists.
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
export function getDataDisplayName(
    data,
    locale,
    { scope, resourceLabel = '' } = {}
) {
    if (resourceLabel && scope === 'logo') {
        return `${resourceLabel} ${data.locale || `#${data.id}`}`;
    }
    const localizedText = (value) => {
        return localizedValue(value, locale, { emptyValue: undefined });
    };

    const title = data.type !== 'Person' && localizedText(data.title);
    if (title) return title;

    if (data.name_type === 'Personal') {
        const name = [
            localizedText(data.first_name),
            localizedText(data.last_name),
        ]
            .filter(Boolean)
            .join(' ');
        if (name) return name;
    }

    const fileLabel =
        data.filename &&
        `${data.filename}${data.locale ? ` (${data.locale})` : ''}`;
    const mediaLabel =
        data.media_type &&
        [data.media_type, data.resolution].filter(Boolean).join(' ');
    return (
        localizedText(data.name) ||
        localizedText(data.code) ||
        localizedText(data.internal_name) ||
        localizedText(data.shortname) ||
        fileLabel ||
        mediaLabel ||
        localizedText(data.url) ||
        (resourceLabel ? `${resourceLabel} #${data.id}` : '')
    );
}
