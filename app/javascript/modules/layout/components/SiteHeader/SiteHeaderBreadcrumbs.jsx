/* global railsMode */
import { useCallback } from 'react';

import classNames from 'classnames';
import { setProjectId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function BreadcrumbDivider() {
    return (
        <svg
            className="SiteHeaderBreadcrumbs-divider"
            width="14"
            height="23"
            viewBox="0 0 14 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <line
                x1="13.0968"
                y1="0.162506"
                x2="0.276304"
                y2="21.9574"
                stroke="black"
                strokeWidth="0.641026"
            />
        </svg>
    );
}

export default function SiteHeaderBreadcrumbs({ crumbs, className }) {
    const { locale } = useI18n();
    const { project } = useProject();
    const dispatch = useDispatch();
    const currentAccount = useSelector(getCurrentUser);

    const accessTokenParam = currentAccount?.access_token
        ? `access_token=${currentAccount.access_token}`
        : null;

    const unsetProjectId = useCallback(
        () => dispatch(setProjectId(null)),
        [dispatch]
    );

    // The OHD logo is always the first breadcrumb node.
    // Archives with their own domain link externally back to OHD; otherwise
    // use a React Router Link so redux state (projectId) is cleared.
    const logoNode = project?.archive_domain ? (
        <a
            title="OHD"
            href={
                `${OHD_DOMAINS[railsMode]}/${locale}` +
                (accessTokenParam ? `?${accessTokenParam}` : '')
            }
            className="SiteHeaderBreadcrumbs-logoLink"
        >
            <img
                className="SiteHeaderBreadcrumbs-logo"
                src="/logo-ohd-no-text.svg"
                alt="OHD"
            />
        </a>
    ) : (
        <Link
            to={`/${locale}`}
            title="OHD"
            onClick={unsetProjectId}
            className="SiteHeaderBreadcrumbs-logoLink"
        >
            <img
                className="SiteHeaderBreadcrumbs-logo"
                src="/logo-ohd.svg"
                alt="OHD"
            />
        </Link>
    );

    if (!project) return null;

    return (
        <nav
            aria-label="breadcrumb"
            className={classNames('SiteHeaderBreadcrumbs', className)}
        >
            <ol className="SiteHeaderBreadcrumbs-list">
                {logoNode && (
                    <li className="SiteHeaderBreadcrumbs-item">{logoNode}</li>
                )}

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;

                    return (
                        <li key={index} className="SiteHeaderBreadcrumbs-item">
                            <BreadcrumbDivider />

                            {isLast || !crumb.to ? (
                                <span
                                    className="SiteHeaderBreadcrumbs-current"
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.to}
                                    className="SiteHeaderBreadcrumbs-link"
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

SiteHeaderBreadcrumbs.propTypes = {
    crumbs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            /** Internal React Router path. Omit for the current (last) page. */
            to: PropTypes.string,
        })
    ).isRequired,
    className: PropTypes.string,
};
