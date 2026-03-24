import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { getProjectLabel } from '../utils';
import { useBreadcrumbModel } from './useBreadcrumbModel';

/**
 * Returns SiteHeader breadcrumb items `{ label, to? }` for the current route.
 */
export function useBreadcrumbs() {
    const { locale } = useI18n();
    const { project } = useProject();
    const { currentPage, items } = useBreadcrumbModel();

    if (!project) {
        return [];
    }

    const projectLabel = project.is_ohd
        ? null
        : getProjectLabel(project, locale);

    if (currentPage.pageType === 'project_startpage') {
        return projectLabel
            ? [{ key: 'archive', label: projectLabel, isProjectRoot: true }]
            : [];
    }

    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    // Map model items to breadcrumb items, ensuring `to` is only included when defined
    const crumbs = items.map((item) => ({
        key: item.key,
        label: item.label,
        to: item.to || undefined,
        isProjectRoot: item.key === 'archive',
    }));

    // Add project root as first breadcrumb item for non-OHD projects
    const shouldPrependProjectRoot =
        projectLabel && crumbs.length > 0 && crumbs[0]?.isProjectRoot !== true;

    if (shouldPrependProjectRoot) {
        return [
            {
                key: 'archive',
                label: projectLabel,
                to: currentPage.pathBase || undefined,
                isProjectRoot: true,
            },
            ...crumbs,
        ];
    }

    return crumbs;
}

export default useBreadcrumbs;
