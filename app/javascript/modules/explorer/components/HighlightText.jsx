import PropTypes from 'prop-types';

import { escapeRegExp, highlightQueryInHtml } from '../utils';

/**
 * Renders `text` with all occurrences of `query` wrapped in a <mark>
 * element so they can be styled as highlighted.
 */
export function HighlightText({ text, query }) {
    if (!query || !text) return text || null;

    const escaped = escapeRegExp(query);
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="Highlight">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
}

/**
 * Renders `html` with all occurrences of `query` wrapped in a <mark>
 * element so they can be styled as highlighted. This is intended for HTML
 * content that needs to be rendered with `dangerouslySetInnerHTML`, and it
 * safely transforms only text nodes to avoid breaking markup or attributes.
 */
export function HighlightHtml({ html, query }) {
    const highlightedHtml = highlightQueryInHtml(html, query);

    if (!highlightedHtml) return null;

    return <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />;
}

export default HighlightText;

HighlightText.propTypes = {
    text: PropTypes.string,
    query: PropTypes.string,
};

HighlightHtml.propTypes = {
    html: PropTypes.string,
    query: PropTypes.string,
};
