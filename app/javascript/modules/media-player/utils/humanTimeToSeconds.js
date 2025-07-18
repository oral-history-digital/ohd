/**
 * Converts a human-readable time string (e.g. "1h23m45s") to seconds.
 *
 * @param {string} timeStr - Time string in the format "HhMmSs" (e.g. "1h23m45s")
 * @returns {number} The total number of seconds
 * @throws {TypeError} If the input format is invalid
 * @throws {RangeError} If minutes or seconds are out of range (greater than 59)
 */
export function humanTimeToSeconds(timeStr) {
    const humanTime = /^(\d{1,2})h(\d{1,2})m(\d{1,2})s$/;
    const match = timeStr.match(humanTime);

    if (!match) {
        throw TypeError('Time format invalid');
    }

    const hours = Number.parseInt(match[1]);
    const minutes = Number.parseInt(match[2]);
    const seconds = Number.parseInt(match[3]);

    if (minutes > 59 || seconds > 59) {
        throw RangeError('Time out of range');
    }

    return hours * 60 * 60 + minutes * 60 + seconds;
}
