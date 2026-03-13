import { useBreadcrumbModel } from 'modules/breadcrumbs';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { getProjectName } from '../utils';

/**
 * Returns SiteHeader breadcrumb items `{ label, to? }` for the current route.
 */
export function useBreadcrumbs() {
    const { locale } = useI18n();
    const { project } = useProject();
    const { currentPage, items } = useBreadcrumbModel();

    if (!project) {
        return null;
    }

    if (currentPage.pageType === 'project_startpage') {
        if (project.is_ohd) {
            return [];
        }

        const projectName = getProjectName(project, locale);
        return projectName ? [{ label: projectName }] : [];
    }

    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    // Logo already represents the home root, so drop the synthetic home item.
    return items
        .filter((item) => item.key !== 'home')
        .map((item) => ({
            label: item.label,
            to: item.to || undefined,
        }));
}

export default useBreadcrumbs;
