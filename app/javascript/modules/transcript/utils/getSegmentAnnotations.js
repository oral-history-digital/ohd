/**
 * Returns segment annotations that exist in the selected content locale.
 *
 * @param {Object} segment - Segment object that may contain an annotations map.
 * @param {string} contentLocale - Transcript/content locale (for example: ger, ukr-public).
 * @returns {Array} Locale-matching annotations.
 */
export function getSegmentAnnotations(segment, contentLocale) {
    if (!segment || typeof contentLocale !== 'string' || !contentLocale) {
        return [];
    }

    return Object.values(segment.annotations || {}).filter((annotation) =>
        Object.prototype.hasOwnProperty.call(
            annotation?.text || {},
            contentLocale
        )
    );
}
