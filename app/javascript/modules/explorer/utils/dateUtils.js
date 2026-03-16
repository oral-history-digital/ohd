/**
 * Extracts the minimum and maximum year from an array of date strings.
 *
 * @param {string[]} dates - Array of date strings (e.g., 'YYYY-MM-DD' or ISO 8601 format)
 * @returns {number[]|null} Array of [minYear, maxYear] or null if no valid dates are found
 *
 * @example
 * getMinMaxYear(['2020-01-15', '2022-06-30', '2021-12-25'])
 * // returns [2020, 2022]
 *
 * getMinMaxYear(['2021-01-01', '2021-12-31'])
 * // returns [2021, 2021]
 *
 * getMinMaxYear([])
 * // returns null
 */
export function getMinMaxYear(dates) {
    const filteredDates = dates
        .map((d) => Date.parse(d))
        .filter((d) => !Number.isNaN(d));

    if (filteredDates.length === 0) {
        return null;
    }

    const minDate = new Date(Math.min(...filteredDates));
    const maxDate = new Date(Math.max(...filteredDates));

    return [minDate.getFullYear(), maxDate.getFullYear()];
}

/**
 * Formats a year range as a human-readable string.
 *
 * Uses an en-dash (U+2013) to separate years when they differ.
 * Returns a single year string when both years are identical.
 *
 * @param {number} year1 - The start year
 * @param {number} year2 - The end year
 * @returns {string} Formatted year range (e.g., '2020–2022' or '2021')
 *
 * @example
 * formatYearRange(2020, 2022)
 * // returns '2020–2022'
 *
 * formatYearRange(2021, 2021)
 * // returns '2021'
 */
export function formatYearRange(year1, year2) {
    if (year1 === year2) {
        return `${year1}`;
    } else {
        return `${year1}–${year2}`;
    }
}
