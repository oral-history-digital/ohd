import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import getProjectLogoSrc from 'modules/startpage/utils/getProjectLogoSrc';
import { useSelector } from 'react-redux';

import { useBreadcrumbModel } from './useBreadcrumbModel';

export const BREADCRUMB_MODES = {
    /** Mode A — OHD is the umbrella; show the OHD logo (default). */
    OHD: 'ohd',
    /** Mode B — independent archive with a logo; show the archive logo. */
    ARCHIVE_LOGO: 'archive_logo',
    /** Mode C — independent archive without a logo; show SimulateLogo. */
    ARCHIVE_NAME: 'archive_name',
};

/**
 * Resolves which breadcrumb root mode applies for the current route.
 *
 * Returns:
 *   mode          — one of BREADCRUMB_MODES
 *   archiveProject — the archive project object (null for Mode A)
 *   archivePath   — explicit link target for the logo.
 *                   null when the container should fall back to usePathBase().
 */
export function useBreadcrumbMode() {
    const { project } = useProject();
    const { locale } = useI18n();
    const { currentPage } = useBreadcrumbModel();
    const projects = useSelector(getProjects);

    const resolveArchiveProject = (archiveIdParam) => {
        if (!archiveIdParam) {
            return null;
        }

        const projectValues = Object.values(projects || {});
        const idAsString = String(archiveIdParam);
        const idLower = idAsString.toLowerCase();

        return (
            projects?.[archiveIdParam] ||
            projectValues.find(
                (candidate) => String(candidate.id) === idAsString
            ) ||
            projectValues.find(
                (candidate) => candidate.shortname?.toLowerCase() === idLower
            ) ||
            projectValues.find(
                (candidate) => candidate.identifier?.toLowerCase() === idLower
            ) ||
            null
        );
    };

    // /:locale/catalog should always start with OHD branding.
    if (
        currentPage.pageType === 'catalog_page' &&
        currentPage.params?.catalogType === 'root'
    ) {
        return {
            mode: BREADCRUMB_MODES.OHD,
            archiveProject: null,
            archivePath: null,
        };
    }

    // Special case: OHD portal catalog page showing a specific archive detail.
    // Use route context directly so it also works if `useProject()` cannot
    // resolve the OHD umbrella project on portal catalog routes.
    // The root logo should reflect *that* archive, not OHD.
    if (
        currentPage.pageType === 'catalog_page' &&
        currentPage.params?.catalogType === 'archives' &&
        currentPage.params?.id
    ) {
        const archiveProject = resolveArchiveProject(currentPage.params.id);

        if (archiveProject) {
            const logoSrc = getProjectLogoSrc(archiveProject, locale);
            return {
                mode: logoSrc
                    ? BREADCRUMB_MODES.ARCHIVE_LOGO
                    : BREADCRUMB_MODES.ARCHIVE_NAME,
                archiveProject,
                // Navigate to the archive's start page on the OHD portal.
                archivePath: `/${archiveProject.shortname}/${locale}`,
            };
        }
    }

    // On archive-scoped routes (/:archiveName/:locale/...), the breadcrumb root
    // should always use the current archive branding (logo or simulated logo).
    if (project && !project.is_ohd) {
        const logoSrc = getProjectLogoSrc(project, locale);
        return {
            mode: logoSrc
                ? BREADCRUMB_MODES.ARCHIVE_LOGO
                : BREADCRUMB_MODES.ARCHIVE_NAME,
            archiveProject: project,
            // null → container resolves via usePathBase().
            archivePath: null,
        };
    }

    return {
        mode: BREADCRUMB_MODES.OHD,
        archiveProject: null,
        archivePath: null,
    };
}

export default useBreadcrumbMode;
