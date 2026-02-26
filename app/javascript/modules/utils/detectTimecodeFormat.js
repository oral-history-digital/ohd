/**
 * Detects the timecode format from a timecode string.
 * @param {string|null|undefined} timecode
 * @returns {'ms'|'frames'|null} - 'ms' for HH:MM:SS.mmm (3 decimal places),
 *   'frames' for HH:MM:SS.ff (2 decimal places, 25fps base), or null if unknown.
 */
export function detectTimecodeFormat(timecode) {
    if (!timecode) return null;
    const match = timecode.match(/^\d{2}:\d{2}:\d{2}\.(\d+)$/);
    if (!match) return null;
    return match[1].length === 2 ? 'frames' : 'ms';
}
