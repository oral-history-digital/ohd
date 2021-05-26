import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function ContributionGroup({
    contributionType,
    className,
    children
}) {
    const { t } = useI18n();

    return (
        <li className={className}>
            <span className="flyout-content-label">
                {t(`contributions.${contributionType}`)}:
            </span>
            {children}
        </li>
    );
}

ContributionGroup.propTypes = {
    contributionType: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
