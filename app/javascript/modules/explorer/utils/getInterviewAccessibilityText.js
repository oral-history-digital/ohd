import { formatNumber } from 'modules/utils';

/**
 * Resolves a translated value to a plain string.
 *
 * The i18n helper `t` may return either a string or an array of renderable
 * fragments when interpolation is used. This helper normalizes the result to a
 * string so it can safely be concatenated, joined, or embedded in other text.
 *
 * @param {Function} t - Translation function from the i18n layer.
 * @param {string} key - Translation key.
 * @param {Object} [values={}] - Interpolation values passed to the translation.
 * @returns {string} The translated value as a plain string.
 */
function tString(t, key, values = {}) {
    const result = t(key, values);
    return Array.isArray(result) ? result.join('') : String(result);
}

/**
 * Builds the accessibility suffix for interview statistics.
 *
 * Returns the text that should appear in parentheses after the total interview
 * count, based on how many interviews are publicly accessible, restricted, or
 * not accessible at all.
 *
 * Cases covered:
 * - totalCount === 0: returns null
 * - no accessible interviews: "currently not accessible"
 * - all public: "accessible after registration"
 * - all restricted: "accessible on demand after registration"
 * - only some public: "X accessible after registration"
 * - only some restricted: "X accessible on demand after registration"
 * - mixed public and restricted: joins both parts with the localized separator
 *
 * All numeric values are formatted using the active locale before being
 * interpolated into translated strings.
 *
 * @param {Object} params
 * @param {number} params.totalCount - Total number of interviews.
 * @param {number} params.publicCount - Number of publicly accessible interviews.
 * @param {number} params.restrictedCount - Number of restricted interviews.
 * @param {Function} params.t - Translation function from the i18n layer.
 * @param {string} params.locale - Active locale used for number formatting.
 * @returns {string|null} Accessibility text for display in parentheses, or null
 *   when no suffix should be shown.
 */
export function getInterviewAccessibilityText({
    totalCount,
    publicCount,
    restrictedCount,
    t,
    locale,
}) {
    if (totalCount === 0) {
        return null;
    }

    const publicStr = formatNumber(publicCount, 0, locale);
    const restrictedStr = formatNumber(restrictedCount, 0, locale);

    if (publicCount === 0 && restrictedCount === 0) {
        return tString(t, 'modules.catalog.currently_not_accessible');
    }

    if (publicCount === totalCount && restrictedCount === 0) {
        return tString(t, 'modules.catalog.accessible_after_registration');
    }

    if (restrictedCount === totalCount && publicCount === 0) {
        return tString(
            t,
            'modules.catalog.accessible_on_demand_after_registration'
        );
    }

    if (publicCount > 0 && restrictedCount === 0) {
        return tString(
            t,
            'modules.catalog.accessible_after_registration_count',
            {
                count: publicStr,
            }
        );
    }

    if (publicCount === 0 && restrictedCount > 0) {
        return tString(
            t,
            'modules.catalog.accessible_on_demand_after_registration_count',
            {
                count: restrictedStr,
            }
        );
    }

    if (publicCount > 0 && restrictedCount > 0) {
        return [
            tString(t, 'modules.catalog.accessible_after_registration_count', {
                count: publicStr,
            }),
            tString(
                t,
                'modules.catalog.accessible_on_demand_after_registration_count',
                {
                    count: restrictedStr,
                }
            ),
        ].join(', ');
    }

    return null;
}

export default getInterviewAccessibilityText;
