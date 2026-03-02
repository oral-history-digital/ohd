import SiteHeaderBreadcrumbs from './SiteHeaderBreadcrumbs';
import useSiteHeaderBreadcrumbs from './useSiteHeaderBreadcrumbs';

export function SiteHeader() {
    const crumbs = useSiteHeaderBreadcrumbs();

    return (
        <header className="SiteHeader">
            <SiteHeaderBreadcrumbs
                crumbs={crumbs}
                className="SiteHeader-breadcrumbs"
            />
        </header>
    );
}

export default SiteHeader;
