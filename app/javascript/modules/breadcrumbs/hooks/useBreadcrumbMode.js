import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import getProjectLogoSrc from 'modules/startpage/utils/getProjectLogoSrc';

export const BREADCRUMB_MODES = {
    /** Mode A — OHD is the umbrella; show the OHD breadcrumb logo (default). */
    OHD: 'ohd',
    /** Mode B — independent archive with a logo; show the archive logo. */
    ARCHIVE_LOGO: 'archive_logo',
    /** Mode C — independent archive that has no logo; show SimulateLogo. */
    ARCHIVE_NAME: 'archive_name',
};

/**
 * Resolves breadcrumb root mode from the current project settings.
 *
 * Rules:
 * - OHD mode when there is no project, the project is OHD, or OHD branding is enabled.
 * - Archive mode otherwise, choosing archive logo when available and archive-name fallback when not.
 */
export function useBreadcrumbMode() {
    const { project } = useProject();
    const { locale } = useI18n();

    if (!project) return BREADCRUMB_MODES.OHD;

    // For non-OHD projects without forced OHD branding, prefer the project logo.
    // If no logo exists for this locale, fall back to archive-name rendering.
    if (!project.is_ohd && !project?.display_ohd_link) {
        const logoSrc = getProjectLogoSrc(project, locale);
        return logoSrc
            ? BREADCRUMB_MODES.ARCHIVE_LOGO
            : BREADCRUMB_MODES.ARCHIVE_NAME;
    }

    return BREADCRUMB_MODES.OHD;
}

export default useBreadcrumbMode;
