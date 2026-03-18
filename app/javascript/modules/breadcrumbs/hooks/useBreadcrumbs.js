import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { getProjectName } from '../utils';
import { BREADCRUMB_MODES } from './useBreadcrumbMode';
import { useBreadcrumbMode } from './useBreadcrumbMode';
import { useBreadcrumbModel } from './useBreadcrumbModel';

/**
 * Returns SiteHeader breadcrumb items `{ label, to? }` for the current route.
 */
export function useBreadcrumbs() {
    const { locale } = useI18n();
    const { project } = useProject();
    const breadcrumbMode = useBreadcrumbMode();
    const { currentPage, items } = useBreadcrumbModel();

    if (!project) return [];

    if (currentPage.pageType === 'project_startpage') {
        if (
            project.is_ohd ||
            breadcrumbMode === BREADCRUMB_MODES.ARCHIVE_LOGO
        ) {
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

    return crumbs;
}

export default useBreadcrumbs;
