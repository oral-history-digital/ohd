import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider } from './Divider';

export function BreadcrumbItem({ crumb, isLast }) {
    const shouldRenderAsCurrent = !crumb.to || (isLast && !crumb.allowLastLink);

    return (
        <li className="Breadcrumbs-item Breadcrumbs-item--crumb">
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
        label: PropTypes.string.isRequired,
        to: PropTypes.string,
        allowLastLink: PropTypes.bool,
    }).isRequired,
    isLast: PropTypes.bool.isRequired,
};

export default BreadcrumbItem;
