import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import getProjectLogoSrc from 'modules/startpage/utils/getProjectLogoSrc';

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

    // /:locale/catalog* should always start with OHD branding.
    if (currentPage.pageType === 'catalog_page') {
        return {
            mode: BREADCRUMB_MODES.OHD,
            archiveProject: null,
            archivePath: null,
        };
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
