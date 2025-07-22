/**
 * Helper function to get sources from VideoJS player
 * Tries currentSources() method first, falls back to sources property
 *
 * @param {Object} player - VideoJS player instance
 * @returns {Array} Array of video sources
 */
export function getPlayerSources(player) {
    if (!player) return [];

    // Try currentSources() method first
    try {
        const sources = player.currentSources?.() || [];
        if (sources.length > 0) return sources;
    } catch (e) {
        // Method not available or failed
    }

    // Fallback to sources property
    return player.sources || [];
}
