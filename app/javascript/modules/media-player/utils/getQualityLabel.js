/**
 * Helper function to get quality label from a video source
 * Uses source label if available, generates from height, or falls back to 480p
 *
 * @param {Object} source - Video source object
 * @returns {string} Quality label (e.g., "720p", "1080p", "480p")
 */
export function getQualityLabel(source) {
    return source.label || (source.height ? `${source.height}p` : '480p');
}
