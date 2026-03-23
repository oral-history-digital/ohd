import classNames from 'classnames';
import { Breadcrumbs } from 'modules/breadcrumbs';
import { useCurrentPage, useProject } from 'modules/routes';
import { ProjectLogo } from 'modules/startpage';

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
        project?.is_ohd || project?.display_ohd_link === true;
    const showBreadcrumbs = !isHome && !showProjectLogo && canShowBreadcrumbs;

    console.log('Rendering SiteHeader', {
        currentPage: currentPage.pageType,
        projectIsOhd: project.is_ohd,
        projectDisplayOhdLink: project.display_ohd_link,
    });

    return (
        <header
            className={classNames('SiteHeader', {
                'SiteHeader--stacked': showProjectLogo,
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
