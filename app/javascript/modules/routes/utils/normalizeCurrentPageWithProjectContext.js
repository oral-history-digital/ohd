/**
 * Normalizes a route-derived page context with explicit project metadata.
 *
 * Why this exists:
 * - `getCurrentPageFromLocation` intentionally stays URL-only and pure.
 * - Some screens still need project context values (`projectShortname`, numeric
 *   `projectId`) even when the URL has no explicit project segment.
 * - The OHD locale root (`/:locale`, e.g. `/de`) is a special case: this page
 *   must remain a site page (`site_startpage`) with no project identifiers.
 *
 * Rules:
 * 1. URL-derived `params.projectShortname` is authoritative when present.
 * 2. If missing, fallback to project context only outside the OHD locale root case.
 * 3. Numeric `projectId` is only set when a project shortname is resolved.
 * 4. OHD locale root remaps `project_startpage` to `site_startpage`.
 */
export default function normalizeCurrentPageWithProjectContext(
    currentPage,
    projectContext = {}
) {
    const {
        isOhd = false,
        projectShortname = null,
        projectId = null,
    } = projectContext;

    // Check whether the route contains a project shortname param
    const routeProjectShortname = currentPage.params?.projectShortname ?? null;
    const isOhdLocaleRoot =
        currentPage.pageType === 'project_startpage' &&
        !routeProjectShortname &&
        isOhd;

    const fallbackProjectShortname = projectShortname ?? null;
    const resolvedProjectShortname = isOhdLocaleRoot
        ? null
        : (routeProjectShortname ?? fallbackProjectShortname);
    const resolvedProjectId = resolvedProjectShortname
        ? (projectId ?? null)
        : null;

    const normalizedCurrentPage = {
        ...currentPage,
        params: {
            ...currentPage.params,
            projectShortname: resolvedProjectShortname,
            projectId: resolvedProjectId,
        },
    };

    if (isOhdLocaleRoot) {
        return {
            ...normalizedCurrentPage,
            pageType: 'site_startpage',
        };
    }

    return normalizedCurrentPage;
}
