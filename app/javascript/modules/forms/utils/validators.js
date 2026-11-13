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
 * Validates HH:MM:SS.mmm with unpadded hours above 99.
 *
 * @param {string} value - Candidate timecode.
 * @returns {boolean} Whether the value is canonical.
 */
export function validateTimecode(value) {
    const pattern =
        /^(?:[0-9]{2}|[1-9][0-9]{2,}):[0-5][0-9]:[0-5][0-9]\.[0-9]{3}(?![\s\S])/;
    return typeof value === 'string' && pattern.test(value);
}

/**
 * Checks the chronological order of two already-validated HH:MM:SS.mmm strings.
 * No conversion to a Number is necessary because the canonical format
 * preserves precision in string comparison.
 *
 * @param {string} earlier - First timecode to compare.
 * @param {string} later - Second timecode to compare.
 * @returns {boolean} True only if the first timecode is strictly before the second.
 */
function isBeforeCanonicalTimecode(earlier, later) {
    // Only hours can vary in width. More hour digits means a later timecode.
    if (earlier.length !== later.length) {
        return earlier.length < later.length;
    }

    // Equal widths align the digits from hours through milliseconds.
    // String comparison preserves precision without converting to a Number.
    return earlier < later;
}

/**
 * Validates a canonical timecode against exclusive canonical bounds.
 *
 * @param {string} value - Candidate timecode.
 * @param {string|null} [minTimecode] - Lower bound.
 * @param {string|null} [maxTimecode] - Upper bound.
 * @returns {boolean} Whether the value and supplied bounds are valid and in order.
 */
export function validateTimecodeInRange(value, minTimecode, maxTimecode) {
    if (!validateTimecode(value)) {
        return false;
    }

    if (
        minTimecode &&
        (!validateTimecode(minTimecode) ||
            !isBeforeCanonicalTimecode(minTimecode, value))
    ) {
        return false;
    }

    if (
        maxTimecode &&
        (!validateTimecode(maxTimecode) ||
            !isBeforeCanonicalTimecode(value, maxTimecode))
    ) {
        return false;
    }

    return true;
}
