import classNames from 'classnames';
import { Breadcrumbs } from 'modules/breadcrumbs';
import { ProjectLogo } from 'modules/project-home';
import { useCurrentPage, useProject } from 'modules/routes';

import SiteLogo from './SiteLogo';

export function SiteHeader() {
    const currentPage = useCurrentPage();
    const { project } = useProject();

    const isHome = currentPage.pageType === 'site_startpage';
    const showProjectLogo =
        !isHome &&
        project &&
        !project?.is_ohd &&
        project?.display_ohd_link === false;
    const canShowBreadcrumbs =
        (project && project?.is_ohd) ||
        (project && project?.display_ohd_link === true);
    const showBreadcrumbs = !isHome && !showProjectLogo && canShowBreadcrumbs;

    return (
        <header
            className={classNames('SiteHeader', {
                'SiteHeader--hasLargeLogo': isHome || showProjectLogo,
                'SiteHeader--hasBreadcrumbs': showBreadcrumbs,
            })}
        >
            {isHome && <SiteLogo />}
            {showProjectLogo && <ProjectLogo project={project} />}
            {showBreadcrumbs && <Breadcrumbs />}
        </header>
    );
}

export default SiteHeader;
