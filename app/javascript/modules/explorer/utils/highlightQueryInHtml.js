import { sanitizeHtml } from 'modules/utils';

/**
 * Sanitizes HTML and wraps query matches in text nodes with <mark class="Highlight">.
 * Tag structure is preserved and only non-tag text segments are highlighted.
 */
export function highlightQueryInHtml(html, query, sanitizeConfig = 'BASIC') {
    const safeHtml = sanitizeHtml(html, sanitizeConfig);
    if (!query || !safeHtml) return safeHtml;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');

    return safeHtml
        .split(/(<[^>]+>)/g)
        .map((part) => {
            if (part.startsWith('<') && part.endsWith('>')) {
                return part;
            }

            return part.replace(regex, '<mark class="Highlight">$1</mark>');
        })
        .join('');
}
