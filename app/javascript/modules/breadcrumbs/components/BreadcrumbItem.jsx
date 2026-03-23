import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider } from './Divider';

export function BreadcrumbItem({ crumb, isLast, index, totalCount }) {
    const shouldRenderAsCurrent = !crumb.to || (isLast && !crumb.allowLastLink);
    const position = index + 1;
    const isFirst = index === 0;
    const isMiddle = index > 0 && index < totalCount - 1;

    const itemClasses = classNames(
        'Breadcrumbs-item',
        'Breadcrumbs-item--crumb',
        {
            'Breadcrumbs-item--projectRoot': crumb.isProjectRoot,
            'Breadcrumbs-item--first': isFirst,
            'Breadcrumbs-item--middle': isMiddle,
            'Breadcrumbs-item--last': isLast,
        }
    );

    return (
        <li
            className={itemClasses}
            data-breadcrumb-position={position}
            data-breadcrumb-total={totalCount}
        >
            <Divider />

            {shouldRenderAsCurrent ? (
                <span
                    className="Breadcrumbs-current Breadcrumbs-label"
                    aria-current={isLast ? 'page' : undefined}
                    title={crumb.label}
                >
                    {crumb.label}
                </span>
            ) : (
                <Link
                    to={crumb.to}
                    className="Breadcrumbs-link Breadcrumbs-label"
                    title={crumb.label}
                >
                    {crumb.label}
                </Link>
            )}
        </li>
    );
}

BreadcrumbItem.propTypes = {
    crumb: PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string.isRequired,
        to: PropTypes.string,
        allowLastLink: PropTypes.bool,
        isProjectRoot: PropTypes.bool,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isLast: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
};

export default BreadcrumbItem;
