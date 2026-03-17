import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { getProjectName, translateWithFallback } from '../utils';
import { BREADCRUMB_MODES, useBreadcrumbMode } from './useBreadcrumbMode';
import { useBreadcrumbModel } from './useBreadcrumbModel';

/**
 * Returns SiteHeader breadcrumb items `{ label, to? }` for the current route.
 */
export function useBreadcrumbs() {
    const { locale, t } = useI18n();
    const { project } = useProject();
    const { currentPage, items } = useBreadcrumbModel();
    const { mode } = useBreadcrumbMode();

    if (!project) {
        return null;
    }

    if (currentPage.pageType === 'project_startpage') {
        if (project.is_ohd) {
            return [];
        }

        // Archive startpage with logo: second line breadcrumb
        // / Catalog / Archive / ArchiveName
        if (mode === BREADCRUMB_MODES.ARCHIVE_LOGO) {
            const projectName =
                getProjectName(project, locale) || project.shortname;
            const catalogLabel = translateWithFallback(
                t,
                'modules.catalog.breadcrumb_title',
                'Catalog'
            );
            const archiveLabel = translateWithFallback(
                t,
                'activerecord.models.project.one',
                'Archive'
            );

            return [
                {
                    label: catalogLabel,
                    to: `/${locale}/catalog`,
                },
                {
                    label: archiveLabel,
                },
                {
                    label: projectName,
                },
            ];
        }

        // Archive startpage without logo: keep breadcrumb inline and only show
        // / Archive & Sammlungen.
        if (mode !== BREADCRUMB_MODES.OHD) {
            const catalogLabel = translateWithFallback(
                t,
                'modules.catalog.breadcrumb_title',
                'Catalog'
            );

            return [{ label: catalogLabel }];
        }

        const projectName = getProjectName(project, locale);
        return projectName ? [{ label: projectName }] : [];
    }

    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    // Logo already represents the home root, so drop the synthetic home item.
    const crumbs = items
        .filter((item) => item.key !== 'home')
        .map((item) => ({
            label: item.label,
            to: item.to || undefined,
        }));

    // On catalog/archives/:id, the root breadcrumb already shows the archive
    // identity (logo or simulated logo), so drop the redundant trailing
    // archive-name crumb.
    if (
        mode !== BREADCRUMB_MODES.OHD &&
        currentPage.pageType === 'catalog_page' &&
        currentPage.params?.catalogType === 'archives' &&
        currentPage.params?.id &&
        crumbs.length > 0
    ) {
        const trimmedCrumbs = crumbs.slice(0, -1);
        return trimmedCrumbs.map((crumb, index) => ({
            ...crumb,
            allowLastLink: index === trimmedCrumbs.length - 1,
        }));
    }

    return crumbs;
}

export default useBreadcrumbs;
