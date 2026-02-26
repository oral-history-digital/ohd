import { FRAMES_PER_SECOND } from 'modules/constants';

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

/**
 * Converts a timecode string to seconds.
 *
 * Supports the following formats:
 * - HH:MM:SS (e.g. "00:01:30")
 * - HH:MM:SS.mmm (milliseconds, e.g. "00:01:30.500" → 90.5s)
 * - HH:MM:SS.ff  (frames at 25fps, e.g. "00:01:30.12" → 90.48s)
 *
 * @param {string|null|undefined} timecode
 * @returns {number} Total seconds (fractional). Returns 0 for falsy input.
 */
export function timecodeToSeconds(timecode) {
    if (!timecode) return 0;
    const parts = timecode.split(':');
    if (parts.length !== 3) return 0;
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
 * @param {number} time - Time duration in seconds with decimal precision (e.g., 114.759
 * @param {boolean} [useHmsFormat=false] - If true, returns HMS format (e.g., "2h45m05s").
 *                                          If false, returns HH:MM:SS format (e.g., "2:45:05")
 * @param {boolean} [includeMilliseconds=false] - If true, appends milliseconds to the output
 *                                                 (e.g., "2:45:05.760" or "2h45m05.760s")
 * @param {boolean} [stripLeadingZeros=false] - If true, removes leading zero hours
 *                                               (e.g., "00:03:46" becomes "3:46", "01:07:28" becomes "1:07:28")
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
    stripLeadingZeros = false
) {
    const hours = Math.floor(time / 3600).toString();
    const minutes = Math.floor((time % 3600) / 60).toString();
    const secondsWithDecimal = time % 60;
    const seconds = Math.floor(secondsWithDecimal).toString();
    const milliseconds = Math.round((secondsWithDecimal % 1) * 1000);

    let str;
    if (useHmsFormat) {
        if (includeMilliseconds) {
            const paddedMilliseconds = milliseconds.toString().padStart(3, '0');
            str = `${hours}h${minutes.padStart(2, '0')}m${seconds.padStart(2, '0')}.${paddedMilliseconds}s`;
        } else {
            str = `${hours}h${minutes.padStart(2, '0')}m${seconds.padStart(2, '0')}s`;
        }
    } else {
        if (includeMilliseconds) {
            const paddedMilliseconds = milliseconds.toString().padStart(3, '0');
            str = `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}.${paddedMilliseconds}`;
        } else {
            str = `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
    }

    // Strip leading zero hours if requested
    if (stripLeadingZeros && !useHmsFormat) {
        // Remove "0:" or "00:" prefix and leading zero from minutes if hours were 0
        str = str.replace(/^0+:0?/, '');
    }

    return str;
}
