import { timecodeToSeconds } from 'modules/utils';

export function validateTapeNumber(v) {
    const number = /^\d{1,2}$/;
    return number.test(v);
}

export function validateColor(v) {
    const color = /^#[0-9,a-f,A-F]{6}$/;
    return color.test(v);
}

export function validateGeoCoordinate(v) {
    const geoCoordinate = /^(-?\d{1,3}(\.\d{0,20})?)?$/;
    return geoCoordinate.test(v);
}

export function validateDate(v) {
    const date = /^\d{4}-\d{2}-\d{2}$/;
    return date.test(v);
}

/**
 * Validates a timecode string, optionally enforcing a specific format.
 * @param {string} v - The timecode value to validate.
 * @param {'ms'|'frames'|null} [format=null] - Expected format. When null, accepts
 *   any valid timecode (1–3 decimal places or none) for backwards compatibility.
 */
export function validateTimecode(v, format = null) {
    if (format === 'frames') {
        // Frames format (25fps): HH:MM:SS or HH:MM:SS.ff (exactly 2 decimal places)
        return /^\d{2}:\d{2}:\d{2}(\.\d{2})?$/.test(v);
    }
    if (format === 'ms') {
        // Milliseconds format: HH:MM:SS or HH:MM:SS.mmm (exactly 3 decimal places)
        return /^\d{2}:\d{2}:\d{2}(\.\d{3})?$/.test(v);
    }
    // Legacy: accept either (1–3 decimal places or none)
    return /^\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(v);
}

/**
 * Validates that a timecode string is within an exclusive range.
 *
 * @param {string} value - The timecode to validate.
 * @param {string|null} minTimecode - Lower bound (exclusive). Pass null to skip.
 * @param {string|null} maxTimecode - Upper bound (exclusive). Pass null to skip.
 * @param {'ms'|'frames'|null} [format=null] - Expected timecode format, passed
 *   through to {@link validateTimecode}.
 * @returns {boolean} True if the value is a valid timecode and strictly between
 *   minTimecode and maxTimecode.
 */
export function validateTimecodeInRange(
    value,
    minTimecode,
    maxTimecode,
    format = null
) {
    if (!validateTimecode(value, format)) {
        return false;
    }

    const valueSeconds = timecodeToSeconds(value);

    if (minTimecode) {
        const minSeconds = timecodeToSeconds(minTimecode);
        if (valueSeconds <= minSeconds) {
            return false;
        }
    }

    if (maxTimecode) {
        const maxSeconds = timecodeToSeconds(maxTimecode);
        if (valueSeconds >= maxSeconds) {
            return false;
        }
    }

    return true;
}
