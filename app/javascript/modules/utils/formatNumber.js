/**
 * Formats a number with locale-specific thousand separators and decimal places
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (optional, defaults to 2)
 * @param locale - Project locale code (e.g., 'de', 'en', 'el'). Defaults to 'de'
 * @param pretty - If true, hides decimal places when they are all zeros (optional, defaults to false)
 * @returns Formatted number string
 *
 * @example
 * // Default formatting (2 decimals, de locale)
 * formatNumber(1234.5678)         // returns "1.234,57"
 * formatNumber(1234)              // returns "1.234,00"
 *
 * // Custom decimals
 * formatNumber(1234.5678, 3)      // returns "1,234.568"
 * formatNumber(1234, 0)           // returns "1,234"
 *
 * // Different locales
 * formatNumber(1234.56, 2, 'de')     // returns "1.234,56"
 * formatNumber(1234.56, 2, 'en')     // returns "1,234.56"
 *
 * // Pretty formatting (hiding zeros in decimal places)
 * formatNumber(60.00, 2, 'en', true)  // returns "60"
 * formatNumber(60.10, 2, 'en', true)  // returns "60.1"
 * formatNumber(60.45, 2, 'en', true)  // returns "60.45"
 */
export function formatNumber(
    value,
    decimals = 2,
    locale = 'de',
    pretty = false
) {
    // For pretty format, check if the value has significant decimal places
    let effectiveDecimals = decimals;

    if (pretty) {
        // Scale the value to check for decimal significance
        const scaledValue = value * Math.pow(10, decimals);
        // If the scaled value is an integer, then original value has no significant decimals at this precision
        if (Number.isInteger(scaledValue)) {
            // Check if all decimal places are zeros
            const decimalPart = Math.abs(value) % 1;
            if (decimalPart === 0) {
                effectiveDecimals = 0;
            } else {
                // Count significant decimal places (non-trailing zeros)
                const decimalStr = decimalPart.toFixed(decimals).slice(2);
                // Remove trailing zeros
                const significantDecimalStr = decimalStr.replace(/0+$/, '');
                effectiveDecimals = significantDecimalStr.length;
            }
        }
    }

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: effectiveDecimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export default formatNumber;
