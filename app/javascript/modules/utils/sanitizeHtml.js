import DOMPurify from 'dompurify';
import { SANITIZE_CONFIG } from 'modules/constants';

/**
 * Sanitizes HTML content using DOMPurify with predefined configurations.
 *
 * @param {string} html - The HTML string to sanitize
 * @param {string} configKey - The sanitization configuration to use:
 *   - 'PLAIN_TEXT': Strips all HTML tags
 *   - 'BASIC': Allows basic formatting (p, br, strong, em, a)
 *   - 'RICH_TEXT': Allows rich content (headings, lists, blockquote)
 *   - 'SEARCH_RESULT': Preserves only search highlighting tags (mark, em, strong)
 * @returns {string} Sanitized HTML string safe for rendering
 *
 * @example
 * // Strip all HTML for error messages
 * sanitizeHtml('<script>alert(1)</script>Error occurred', 'PLAIN_TEXT')
 * // Returns: "Error occurred"
 *
 * @example
 * // Preserve search highlighting
 * sanitizeHtml('Found <mark>keyword</mark> in text', 'SEARCH_RESULT')
 * // Returns: "Found <mark>keyword</mark> in text"
 */
export default function sanitizeHtml(html, configKey = 'BASIC') {
    if (!html) {
        console.warn('sanitizeHtml called with empty input');
        return '';
    }

    if (typeof html !== 'string') {
        console.warn(
            `sanitizeHtml expected a string but received ${typeof html}`
        );
        return '';
    }

    const config = SANITIZE_CONFIG[configKey];

    if (!config) {
        console.error(
            `Invalid sanitization config key: ${configKey}. Using BASIC config.`
        );
        return DOMPurify.sanitize(html, SANITIZE_CONFIG.BASIC);
    }

    return DOMPurify.sanitize(html, config);
}
