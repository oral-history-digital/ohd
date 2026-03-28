import classNames from 'classnames';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

import { Divider } from './Divider';

export function BreadcrumbItem({ crumb, isLast, index, totalCount }) {
    const shouldRenderAsCurrent = !crumb.to || (isLast && !crumb.allowLastLink);
    const position = index + 1;
    const isFirst = index === 0;
    const isMiddle = index > 0 && index < totalCount - 1;
    const labelClasses = classNames('Breadcrumbs-label');
    const renderedLabel = crumb.loading ? (
        <Skeleton width="20ch" inline />
    ) : (
        crumb.label
    );

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
                    className={classNames('Breadcrumbs-current', labelClasses)}
                    aria-current={isLast ? 'page' : undefined}
                    aria-busy={crumb.loading || undefined}
                    title={crumb.label}
                >
                    {renderedLabel}
                </span>
            ) : (
                <Link
                    to={crumb.to}
                    className={classNames('Breadcrumbs-link', labelClasses)}
                    aria-busy={crumb.loading || undefined}
                    title={crumb.label}
                >
                    {renderedLabel}
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
        loading: PropTypes.bool,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isLast: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
};

export default BreadcrumbItem;
