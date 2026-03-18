import classNames from 'classnames';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';

import { BreadcrumbItem, Logo, SimulateLogo } from './components';
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
                    return (
                        <BreadcrumbItem
                            key={index}
                            crumb={crumb}
                            isLast={index === crumbs.length - 1}
                        />
                    );
                })}
            </ol>
        </nav>
    );
}

Breadcrumbs.propTypes = {
    logoSrc: PropTypes.string,
};
