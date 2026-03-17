import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { getProjectName } from '../utils';
import { BREADCRUMB_MODES, useBreadcrumbMode } from './useBreadcrumbMode';
import { useBreadcrumbModel } from './useBreadcrumbModel';

/**
 * Returns SiteHeader breadcrumb items `{ label, to? }` for the current route.
 */
export function useBreadcrumbs() {
    const { locale } = useI18n();
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

        // Modes B/C: the root logo element already represents the archive,
        // so no additional crumb is needed.
        if (mode !== BREADCRUMB_MODES.OHD) {
            return [];
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
