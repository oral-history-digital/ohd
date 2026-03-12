import { Breadcrumbs } from 'modules/breadcrumbs';
import { useCurrentPage } from 'modules/routes';

import SiteLogo from './SiteLogo';

export function SiteHeader() {
    const currentPage = useCurrentPage();
    const isHome = currentPage.pageType === 'site_startpage';

    return (
        <header className="SiteHeader">
            {isHome ? <SiteLogo /> : <Breadcrumbs />}
        </header>
    );
}

export default SiteHeader;
