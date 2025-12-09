import PropTypes from 'prop-types';

import useContributionTypeLabel from './useContributionTypeLabel';

export default function ContributionGroup({
    contributionType,
    className,
    children,
}) {
    const label = useContributionTypeLabel(contributionType);

    return (
        <li className={className}>
            <span className="flyout-content-label">{label}:</span>
            {children}
        </li>
    );
}

ContributionGroup.propTypes = {
    contributionType: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
