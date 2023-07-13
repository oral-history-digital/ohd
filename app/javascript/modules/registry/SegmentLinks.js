import PropTypes from 'prop-types';

import RefObjectLinkContainer from './RefObjectLinkContainer';

export default function SegmentLinks({
    references,
    onSubmit,
}) {
    return (
        <ul className="HorizontalList">
            {references.map((reference) => (
                <li key={reference.id} className="HorizontalList-item">
                    <RefObjectLinkContainer registryReference={reference} onSubmit={onSubmit} />
                </li>
            ))}
        </ul>
    );
}

SegmentLinks.propTypes = {
    references: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
};
