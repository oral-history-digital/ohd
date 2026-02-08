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
export default function formatTimecode(
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
