import SiteHeaderBreadcrumbs from './SiteHeaderBreadcrumbs';
import useSiteHeaderBreadcrumbs from './useSiteHeaderBreadcrumbs';

export function SiteHeader() {
    const crumbs = useSiteHeaderBreadcrumbs();

    // null means project not loaded yet — render nothing to avoid logo flash
    if (crumbs === null) return <header className="SiteHeader" />;

    return (
        <header className="SiteHeader">
            <SiteHeaderBreadcrumbs
                crumbs={crumbs}
                logoSrc={
                    crumbs.length > 0
                        ? '/logo-ohd-no-text.svg'
                        : '/logo-ohd.svg'
                }
                className="SiteHeader-breadcrumbs"
            />
        </header>
    );
}

export default SiteHeader;
