/**
 * Reads the current page's Rails authenticity token.
 *
 * @returns {string} The token, or an empty string when the page has none.
 */
export function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : '';
}
