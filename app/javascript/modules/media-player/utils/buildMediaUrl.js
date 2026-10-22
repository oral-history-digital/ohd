/**
 * Builds a media URL through the authorized project route.
 *
 * @param {string|null} suffix - File extension from the playback descriptor.
 * @param {string} pathBase - Project and locale route prefix.
 * @param {string} archiveId - Public interview identifier.
 * @param {number} tape - Tape number.
 * @param {string} resolution - Stream quality or format.
 * @returns {string} Media request URL.
 */
export function buildMediaUrl(suffix, pathBase, archiveId, tape, resolution) {
    const url = `${pathBase}/media_streams/${archiveId}/${tape}/${resolution}.${suffix}`;
    return url;
}
