/**
 * Checks if an HTML string is empty after stripping tags and whitespace.
 *
 * Removes all HTML tags from the input string and checks if any text content
 * remains. Returns true if the string is null, undefined, or contains only
 * whitespace/HTML tags.
 *
 * @param {string|null|undefined} html - The HTML string to check
 * @returns {boolean} True if the HTML is empty or contains no text content, false otherwise
 *
 * @example
 * isEmptyHtml('<p>Hello</p>')
 * // returns false
 *
 * isEmptyHtml('<p></p>')
 * // returns true
 *
 * isEmptyHtml('   <br/>   ')
 * // returns true
 *
 * isEmptyHtml(null)
 * // returns true
 */
export default function isEmptyHtml(html) {
    if (!html) return true;
    // Strip HTML tags and check if any text content remains
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
}
