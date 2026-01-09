/**
 * Formats a time duration in seconds to a human-readable timecode string.
 *
 * @param {number} time - Time duration in seconds with decimal precision (e.g., 114.759
 * @param {boolean} [useHmsFormat=false] - If true, returns HMS format (e.g., "2h45m05s").
 *                                          If false, returns HH:MM:SS format (e.g., "2:45:05")
 * @param {boolean} [includeMilliseconds=false] - If true, appends milliseconds to the output
 *                                                 (e.g., "2:45:05.760" or "2h45m05.760s")
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
 */
export default function formatTimecode(
    time,
    useHmsFormat = false,
    includeMilliseconds = false
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

    return str;
}
