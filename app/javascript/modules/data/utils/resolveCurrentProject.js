import { normalizeProjectDbId, normalizeShortname } from './normalizeIds';

/**
 * Resolve current project identity from explicit inputs.
 *
 * Resolution order:
 * 1. Route shortname in cache
 * 2. Domain fallback in cache
 * 3. Optional fallback project (for example from SWR)
 */
export function resolveCurrentProject({
    projects = {},
    routeProjectShortname = null,
    domainOrigin = null,
    fallbackProject = null,
} = {}) {
    const projectList = Object.values(projects || {});
    const normalizedRouteShortname = normalizeShortname(routeProjectShortname);

    // First try to resolve from route shortname
    if (normalizedRouteShortname) {
        const routeProject = projectList.find(
            (project) => project.shortname === normalizedRouteShortname
        );

        if (routeProject) {
            return {
                project: routeProject,
                projectShortname: routeProject.shortname || null,
                projectDbId: normalizeProjectDbId(routeProject.id),
                source: 'route-cache',
            };
        }
    }

    // Then try to resolve from domain
    if (!normalizedRouteShortname && domainOrigin) {
        const domainProject = projectList.find(
            (project) => project.archive_domain === domainOrigin
        );

        if (domainProject) {
            return {
                project: domainProject,
                projectShortname: domainProject.shortname || null,
                projectDbId: normalizeProjectDbId(domainProject.id),
                source: 'domain-cache',
            };
        }
    }

    // Finally, if a fallback project is provided (e.g. from SWR), use it
    // if it matches the route shortname (if present)
    if (fallbackProject) {
        return {
            project: fallbackProject,
            projectShortname:
                normalizeShortname(fallbackProject.shortname) ||
                normalizedRouteShortname,
            projectDbId: normalizeProjectDbId(fallbackProject.id),
            source: 'swr',
        };
    }

    return {
        project: null,
        projectShortname: normalizedRouteShortname,
        projectDbId: null,
        source: 'unresolved',
    };
}

export default resolveCurrentProject;
