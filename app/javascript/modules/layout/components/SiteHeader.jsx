import classNames from 'classnames';
import { Breadcrumbs } from 'modules/breadcrumbs';
import { BREADCRUMB_MODES, useBreadcrumbMode } from 'modules/breadcrumbs';
import { useCurrentPage } from 'modules/routes';
import { useProject } from 'modules/routes';
import { ProjectLogo } from 'modules/startpage';

import SiteLogo from './SiteLogo';

export function SiteHeader() {
    const currentPage = useCurrentPage();
    const isHome = currentPage.pageType === 'site_startpage';
    const breadcrumbMode = useBreadcrumbMode();
    const { project } = useProject();

    const showProjectLogo =
        !isHome && breadcrumbMode === BREADCRUMB_MODES.ARCHIVE_LOGO && project;

    return (
        <header
            className={classNames('SiteHeader', {
                'SiteHeader--stacked': showProjectLogo,
            })}
        >
            {isHome && <SiteLogo />}
            {showProjectLogo && <ProjectLogo project={project} />}
            {!isHome && <Breadcrumbs />}
        </header>
    );
}

export default SiteHeader;
