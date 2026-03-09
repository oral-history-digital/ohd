/**
 * Replace a small set of HTML entities used in transcript text with
 * their corresponding characters.
 *
 * Currently handles:
 * - `&quot;` -> `"`
 * - `&apos;` -> `` ` `` (preserve existing app behavior)
 *
 * Returns the original value for null/undefined inputs.
 *
 * @param {string|null|undefined} value
 * @returns {string|undefined}
 */
export function unescapeHtmlEntities(value) {
    if (value == null) return value;
    return value.replace(/&quot;/g, '"').replace(/&apos;/g, '`');
}

export default unescapeHtmlEntities;
