import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider, Logo } from './components';
import { useBreadcrumbs } from './hooks';

export default function Breadcrumbs({ logoSrc }) {
    const crumbs = useBreadcrumbs();

    return (
        <nav aria-label="breadcrumb" className={classNames('Breadcrumbs')}>
            <ol className="Breadcrumbs-list">
                <li className="Breadcrumbs-item">
                    <Logo logoSrc={logoSrc} />
                </li>

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;

                    return (
                        <li key={index} className="Breadcrumbs-item">
                            <Divider />

                            {isLast || !crumb.to ? (
                                <span
                                    className="Breadcrumbs-current"
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.to}
                                    className="Breadcrumbs-link"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

Breadcrumbs.propTypes = {
    logoSrc: PropTypes.string,
};
