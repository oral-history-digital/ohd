import PropTypes from 'prop-types';

import parseTextWithUrls from './parseTextWithUrls';

const isUrlRegexp = /^https?:\/\//i;

export default function ContentValueWithLinks({ children }) {
    const parsedText = parseTextWithUrls(children);

    return parsedText.map((part, index) => {
        const isUrl = isUrlRegexp.test(part);

        if (isUrl) {
            return (
                <a key={index} href={part} target="_blank" rel="noreferrer">
                    {part}
                </a>
            );
        } else {
            return <span key={index}>{part}</span>;
        }
    });
}

ContentValueWithLinks.propTypes = {
    children: PropTypes.string.isRequired,
};
