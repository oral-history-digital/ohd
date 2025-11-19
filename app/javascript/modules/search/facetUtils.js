/**
 * Extracts the min and max years from a facet value string.
 * Facet values are formatted like: "1955.0..1960.0"
 *
 * @param {string} value - The facet value string
 * @returns {{ min: number, max: number } | null} An object with min and max years, or null if invalid
 */
export function extractYearRange(value) {
    if (!value || typeof value !== 'string') return null;

    // Ensure the string is long enough to extract both years
    if (value.length < 12) return null;

    const min = Number(value.slice(0, 4));
    const max = Number(value.slice(8, 12));

    if (isNaN(min) || isNaN(max)) return null;

    return { min, max };
}

/**
 * Extracts year range from an array of facet values.
 * Returns the minimum year from the first value and maximum year from the last value.
 *
 * @param {string[]} values - Array of facet value strings
 * @returns {{ min: number, max: number } | null} An object with min and max years, or null if invalid
 */
export function extractYearRangeFromValues(values) {
    if (!Array.isArray(values) || values.length === 0) return null;

    const firstValue = values.at(0);
    const lastValue = values.at(-1);

    if (!firstValue || !lastValue) return null;

    const firstRange = extractYearRange(firstValue);
    const lastRange = extractYearRange(lastValue);

    if (!firstRange || !lastRange) return null;

    return {
        min: firstRange.min,
        max: lastRange.max,
    };
}

/**
 * Extracts birth years from facet subfacets.
 * Converts subfacet keys to integers and returns min/max.
 *
 * @param {Object} subfacets - The subfacets object with year keys
 * @returns {{ min: number, max: number } | null} An object with min and max birth years, or null if invalid
 */
export function extractBirthYearRange(subfacets) {
    if (!subfacets || typeof subfacets !== 'object') {
        return null;
    }

    const years = Object.keys(subfacets).map((year) => Number.parseInt(year));

    if (years.length === 0 || years.some(isNaN)) {
        return null;
    }

    return {
        min: Math.min(...years),
        max: Math.max(...years),
    };
}

/**
 * Validates that facetData has the required properties for a given locale.
 *
 * @param {Object} facetData - The facet data object
 * @param {string} locale - The current locale
 * @param {boolean} requireSubfacets - Whether subfacets are required
 * @returns {boolean} True if valid, false otherwise
 */
export function isFacetDataValid(facetData, locale, requireSubfacets = true) {
    if (!facetData) {
        return false;
    }

    if (!facetData.name?.[locale]) {
        return false;
    }

    if (requireSubfacets && !facetData.subfacets) {
        return false;
    }

    return true;
}

/**
 * Finds an event type by code from the event types list.
 *
 * @param {Array} eventTypes - Array of event type objects
 * @param {string} code - The event type code to find
 * @returns {Object | null} The event type object or null if not found or invalid
 */
export function findEventTypeByCode(eventTypes, code) {
    if (!Array.isArray(eventTypes) || !code) {
        return null;
    }

    const eventType = eventTypes.find((et) => et.code === code);

    if (!eventType || !eventType.name) {
        return null;
    }

    return eventType;
}
