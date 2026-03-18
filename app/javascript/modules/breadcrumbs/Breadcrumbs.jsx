import classNames from 'classnames';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Divider, Logo, SimulateLogo } from './components';
import { BREADCRUMB_MODES, useBreadcrumbMode } from './hooks/useBreadcrumbMode';
import { useBreadcrumbs } from './hooks/useBreadcrumbs';

export default function Breadcrumbs({ logoSrc }) {
    const breadcrumbMode = useBreadcrumbMode();
    const { project } = useProject();
    const crumbs = useBreadcrumbs();

    function renderBreadcrumbRootLogo() {
        if (breadcrumbMode === BREADCRUMB_MODES.ARCHIVE_LOGO) {
            return null;
        }

        if (breadcrumbMode === BREADCRUMB_MODES.ARCHIVE_NAME) {
            return <SimulateLogo project={project} />;
        }

        return <Logo logoSrc={logoSrc} />;
    }

    const breadcrumbRootLogo = renderBreadcrumbRootLogo();

    if (crumbs.length === 0 && !breadcrumbRootLogo) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className={classNames('Breadcrumbs')}>
            <ol className="Breadcrumbs-list">
                {breadcrumbRootLogo && (
                    <li className="Breadcrumbs-item">{breadcrumbRootLogo}</li>
                )}

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    const shouldRenderAsCurrent =
                        !crumb.to || (isLast && !crumb.allowLastLink);

                    return (
                        <li key={index} className="Breadcrumbs-item">
                            <Divider />

                            {shouldRenderAsCurrent ? (
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
