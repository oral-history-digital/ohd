import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useLocation } from 'react-router-dom';

/**
 * Returns the breadcrumb items to display after the logo in SiteHeader.
 *
 * Each item is `{ label: string, to?: string }`.
 * - `to` is the React Router path for intermediate (linked) items.
 * - The last item should have no `to` — it represents the current page.
 *
 * NOTE: This hook currently uses dummy data to demonstrate multi-level
 * hierarchies. Once a real routing context hook is ready, replace the
 * matching logic below while keeping the return shape identical.
 *
 * Covered paths (examples):
 *   /de/catalog                       → Archive & Sammlungen
 *   /de/catalog/archives/:id          → Archive & Sammlungen → <archive name>
 *   /de/catalog/collections/:id       → Archive & Sammlungen → <collection name>
 *   /de/catalog/institutions/:id      → Archive & Sammlungen → <institution name>
 *   /fvv/de  (OHD domain, project)    → Zeitzeugenarchiv FVV
 *   /de      (archive_domain project) → <project name>
 */
export default function useSiteHeaderBreadcrumbs() {
    const { locale, t } = useI18n();
    const { project } = useProject();
    const { pathname } = useLocation();

    const catalogLabel = t('modules.catalog.breadcrumb_title');
    const catalogPath = `/${locale}/catalog`;

    // /[locale]/catalog/archives/:id
    if (/\/[^/]+\/catalog\/archives\/[^/]+$/.test(pathname)) {
        return [
            { label: catalogLabel, to: catalogPath },
            // TODO: replace with real archive name from store once hook is ready
            { label: 'Zeitzeugenarchiv FVV' },
        ];
    }

    // /[locale]/catalog/collections/:id
    if (/\/[^/]+\/catalog\/collections\/[^/]+$/.test(pathname)) {
        return [
            { label: catalogLabel, to: catalogPath },
            // TODO: replace with real collection name from store once hook is ready
            { label: 'Sammlung' },
        ];
    }

    // /[locale]/catalog/institutions/:id
    if (/\/[^/]+\/catalog\/institutions\/[^/]+$/.test(pathname)) {
        return [
            { label: catalogLabel, to: catalogPath },
            // TODO: replace with real institution name from store once hook is ready
            { label: 'Institution' },
        ];
    }

    // /[locale]/catalog  (exact)
    if (/\/[^/]+\/catalog\/?$/.test(pathname)) {
        return [{ label: catalogLabel }];
    }

    // OHD home page (/[locale]) — logo only, no crumbs
    if (project?.is_ohd) {
        return [];
    }

    // Project home on OHD domain: /[projectId]/[locale]
    // project.is_ohd is false for collection projects; archive_domain is absent
    if (project && !project.is_ohd && !project.archive_domain) {
        const projectName =
            project.name?.[locale] ||
            project.name?.[project.default_locale] ||
            project.shortname;
        if (projectName) {
            return [{ label: projectName }];
        }
    }

    // Project home on own domain: /[locale]
    if (project && project.archive_domain) {
        const projectName =
            project.name?.[locale] ||
            project.name?.[project.default_locale] ||
            project.shortname;
        if (projectName) {
            return [{ label: projectName }];
        }
    }

    return [];
}
