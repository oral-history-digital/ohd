import { normalizeTimecode, timecodeToSeconds } from 'modules/utils';

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
 * Accepts both dot and colon separators for sub-second precision:
 * - HH:MM:SS, HH:MM:SS.FF or HH:MM:SS:FF (frames)
 * - HH:MM:SS, HH:MM:SS.MMM or HH:MM:SS:MMM (milliseconds)
 *
 * @param {string} v - The timecode value to validate.
 * @param {'ms'|'frames'|null} [format=null] - Expected format. When null, accepts
 *   any valid timecode (1–3 decimal places or none) for backwards compatibility.
 */
export function validateTimecode(v, format = null) {
    // Validate basic structure: HH:MM:SS with optional sub-seconds using either : or . separator
    const basicFormat = /^\d{2}:\d{2}:\d{2}([:.]\d{1,3})?$/.test(v);
    if (!basicFormat) {
        return false;
    }

    // If no specific format required, accept any valid timecode
    if (!format) {
        return true;
    }

    // Normalize to dot separator for format validation
    const normalized = normalizeTimecode(v);
    if (!normalized) {
        return false;
    }

    if (format === 'frames') {
        // Frames format (25fps): exactly 2 digits after separator (or none)
        return /^\d{2}:\d{2}:\d{2}(\.\d{2})?$/.test(normalized);
    }

    if (format === 'ms') {
        // Milliseconds format: exactly 3 digits after separator (or none)
        return /^\d{2}:\d{2}:\d{2}(\.\d{3})?$/.test(normalized);
    }

    return false;
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
