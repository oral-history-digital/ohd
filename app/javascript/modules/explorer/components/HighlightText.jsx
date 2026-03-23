import PropTypes from 'prop-types';

/**
 * Renders `text` with all occurrences of `query` wrapped in a <mark>
 * element so they can be styled as highlighted.
 */
export function HighlightText({ text, query }) {
    if (!query || !text) return text || null;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

export default HighlightText;

HighlightText.propTypes = {
    text: PropTypes.string,
    query: PropTypes.string,
};
