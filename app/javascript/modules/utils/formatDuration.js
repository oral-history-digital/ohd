import isNil from 'lodash.isnil';

/**
 * Converts a value in seconds into a human-readable duration string.
 *
 * The value is floored to whole seconds, negative values are clamped to 0,
 * and non-finite inputs return null.
 *
 * @param {number} seconds - Duration in seconds.
 * @returns {string|null} Formatted duration in "HH h MM min" or null for invalid input.
 */
export function formatDurationFromSeconds(seconds) {
    if (!Number.isFinite(seconds)) {
        return null;
    }

    const totalSeconds = Math.max(0, Math.floor(seconds));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        '0'
    );

    return `${hours} h ${minutes} min`;
}

/**
 * Formats mixed duration input into a human-readable duration string.
 *
 * Supports:
 * - Timecode-like strings (e.g. "01:48:00.000")
 * - Numeric strings interpreted as seconds (e.g. "3600")
 * - Numeric values interpreted as seconds
 *
 * Returns the provided fallback for nullish or unsupported values.
 *
 * @param {string|number|null|undefined} value - Duration input.
 * @param {string} [none='---'] - Fallback returned for invalid or missing values.
 * @returns {string} Formatted duration or fallback.
 */
export function formatDuration(value, none = '---') {
    if (isNil(value)) {
        return none;
    }

    if (typeof value === 'string') {
        const trimmedValue = value.trim();

        if (trimmedValue.includes(':')) {
            const [hours = '00', minutes = '00'] = trimmedValue.split(':');
            return `${hours} h ${minutes} min`;
        }

        const numericValue = Number(trimmedValue);
        const formattedNumericDuration =
            formatDurationFromSeconds(numericValue);
        return formattedNumericDuration || none;
    }

    if (typeof value === 'number') {
        return formatDurationFromSeconds(value) || none;
    }

    return none;
}
