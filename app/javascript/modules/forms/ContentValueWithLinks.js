import PropTypes from 'prop-types';

import parseTextWithUrls from './parseTextWithUrls';

const isUrlRegexp = /^https?:\/\//i;

export default function ContentValueWithLinks({
    children
}) {
    const parsedText = parseTextWithUrls(children);

    return parsedText.map(part => {
        const isUrl = isUrlRegexp.test(part);

        if (isUrl) {
            return (
                <a href={part} target="_blank" rel="noreferrer">
                    {part}
                </a>
            );
        } else {
            return <span>{part}</span>;
        }
    });
}

ContentValueWithLinks.propTypes = {
    children: PropTypes.string.isRequired,
}
