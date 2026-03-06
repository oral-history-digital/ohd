import { FRAMES_PER_SECOND } from 'modules/constants';

/**
 * Normalizes a timecode string to use dot separator for sub-second precision.
 * Converts HH:MM:SS:FF or HH:MM:SS:MMM to HH:MM:SS.FF or HH:MM:SS.MMM
 *
 * @param {string|null|undefined} timecode - Timecode to normalize
 * @returns {string|null} Normalized timecode with dot separator, or null if invalid
 */
export function normalizeTimecode(timecode) {
    if (!timecode) return null;

    const colonParts = timecode.split(':');

    // If there are 4 parts, the last one is sub-seconds (replace colon with dot)
    if (colonParts.length === 4) {
        return colonParts.slice(0, 3).join(':') + '.' + colonParts[3];
    }

    // If there are 3 parts, already in HH:MM:SS or HH:MM:SS.X format
    if (colonParts.length === 3) {
        return timecode;
    }

    // Invalid format
    return null;
}

/**
 * Detects the timecode format from a timecode string.
 * @param {string|null|undefined} timecode
 * @returns {'ms'|'frames'|null} - 'ms' for HH:MM:SS.mmm (3 decimal places),
 *   'frames' for HH:MM:SS.ff (2 decimal places, 25fps base), or null if unknown.
 */
export function detectTimecodeFormat(timecode) {
    if (!timecode) return null;
    const normalized = normalizeTimecode(timecode);
    if (!normalized) return null;
    const match = normalized.match(/^\d{2}:\d{2}:\d{2}\.(\d+)$/);
    if (!match) return null;
    return match[1].length === 2 ? 'frames' : 'ms';
}

/**
 * Converts a timecode string to seconds.
 *
 * Supports the following formats:
 * - HH:MM:SS (e.g. "00:01:30")
 * - HH:MM:SS.mmm (milliseconds, e.g. "00:01:30.500" → 90.5s)
 * - HH:MM:SS.ff  (frames at 25fps, e.g. "00:01:30.12" → 90.48s)
 * - HH:MM:SS:mmm (milliseconds with colon separator, e.g. "00:01:30:500" → 90.5s)
 * - HH:MM:SS:ff  (frames with colon separator, e.g. "00:01:30:12" → 90.48s)
 *
 * @param {string|null|undefined} timecode
 * @returns {number} Total seconds (fractional). Returns 0 for falsy input.
 */
export function timecodeToSeconds(timecode) {
    if (!timecode) return 0;

    // Normalize colon-based frames/milliseconds format to dot-based format
    const normalized = normalizeTimecode(timecode);
    if (!normalized) return 0;

    const parts = normalized.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const secondsParts = parts[2].split('.');
    const seconds = parseInt(secondsParts[0], 10);
    let frac = 0;
    if (secondsParts[1]) {
        if (secondsParts[1].length === 2) {
            // Frames format (25fps): divide frame number by FPS
            frac = parseInt(secondsParts[1], 10) / FRAMES_PER_SECOND;
        } else {
            // Milliseconds format: pad to 3 digits
            frac = parseInt(secondsParts[1].padEnd(3, '0'), 10) / 1000;
        }
    }
    return hours * 3600 + minutes * 60 + seconds + frac;
}

/**
 * Formats a time duration in seconds to a human-readable timecode string.
 *
 * @param {number} time - Time duration in seconds with decimal precision (e.g., 114.759)
 * @param {boolean} [useHmsFormat=false] - If true, returns HMS format (e.g., "2h45m05s").
 *                                          If false, returns HH:MM:SS format (e.g., "2:45:05")
 * @param {boolean} [includeMilliseconds=false] - If true, appends sub-second precision to the
 *                                                 output. The representation depends on `format`.
 * @param {boolean} [stripLeadingZeros=false] - If true, removes leading zero hours
 *                                               (e.g., "00:03:46" becomes "3:46", "01:07:28" becomes "1:07:28")
 * @param {'ms'|'frames'} [format='ms'] - Sub-second format when `includeMilliseconds` is true.
 *                                         'ms'     → 3-digit milliseconds  (e.g., ".760")
 *                                         'frames' → 2-digit frame number at 25 fps (e.g., ".19")
 *                                         Mirrors the return values of {@link detectTimecodeFormat}.
 *
 * @returns {string} Formatted timecode string
 *
 * @example
 * // Returns "0:00:25"
 * formatTimecode(25.3)
 *
 * @example
 * // Returns "0:00:25.300"
 * formatTimecode(25.3, false, true)
 *
 * @example
 * // Returns "0:00:25.07" (25.3s → frame 7 of 25)
 * formatTimecode(25.3, false, true, false, 'frames')
 *
 * @example
 * // Returns "2h45m05s"
 * formatTimecode(9905.9, true)
 *
 * @example
 * // Returns "3:46"
 * formatTimecode(226, false, false, true)
 *
 * @example
 * // Returns "1:07:28"
 * formatTimecode(4048, false, false, true)
 */
export function formatTimecode(
    time,
    useHmsFormat = false,
    includeMilliseconds = false,
    stripLeadingZeros = false,
    format = 'ms'
) {
    const hours = Math.floor(time / 3600).toString();
    const minutes = Math.floor((time % 3600) / 60).toString();
    const secondsWithDecimal = time % 60;
    const seconds = Math.floor(secondsWithDecimal).toString();

    let fracStr = '';
    if (includeMilliseconds) {
        const frac = secondsWithDecimal % 1;
        if (format === 'frames') {
            const frames = Math.round(frac * FRAMES_PER_SECOND);
            fracStr = `.${frames.toString().padStart(2, '0')}`;
        } else {
            const ms = Math.round(frac * 1000);
            fracStr = `.${ms.toString().padStart(3, '0')}`;
        }
    }

    let str;
    if (useHmsFormat) {
        str = `${hours}h${minutes.padStart(2, '0')}m${seconds.padStart(2, '0')}${fracStr}s`;
    } else {
        str = `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}${fracStr}`;
    }

    // Strip leading zero hours if requested
    if (stripLeadingZeros && !useHmsFormat) {
        // Remove "0:" or "00:" prefix and leading zero from minutes if hours were 0
        str = str.replace(/^0+:0?/, '');
    }

    return str;
}
