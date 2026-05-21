import { getProjects } from 'modules/data';
import isLocaleValid from 'modules/routes/isLocaleValid';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import { normalizeProjectDbId, resolveCurrentProject } from '../utils';
import { useGetProject } from './useGetProject';

/**
 * Central current-project resolver for frontend consumers.
 */
export function useCurrentProject({
    lite = true,
    enableSWRFallback = true,
} = {}) {
    // Get projects from Redux store
    const projects = useSelector(getProjects);
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const routeProjectShortname =
        matchWithProject && isLocaleValid(matchWithProject.params.locale)
            ? matchWithProject.params.projectId
            : null;
    const domainOrigin = window.location.origin;

    // First try to resolve from cache (Redux store)
    const cacheResolution = resolveCurrentProject({
        projects,
        routeProjectShortname,
        domainOrigin,
    });

    // If not resolved from cache, and SWR fallback enabled, fetch project by shortname
    const shouldFetchByShortname =
        enableSWRFallback &&
        Boolean(routeProjectShortname) &&
        !cacheResolution.project;

    const {
        project: swrProject,
        loading,
        error,
    } = useGetProject({
        shortname: shouldFetchByShortname ? routeProjectShortname : null,
        lite,
    });

    const resolvedSWRProject = swrProject
        ? {
              project: swrProject,
              projectShortname:
                  swrProject.shortname || routeProjectShortname || null,
              projectDbId: normalizeProjectDbId(swrProject.id),
              source: 'swr',
          }
        : null;

    const resolved = cacheResolution.project
        ? cacheResolution
        : resolvedSWRProject
          ? resolvedSWRProject
          : cacheResolution;

    const isResolved =
        Boolean(resolved.project) &&
        Boolean(resolved.projectShortname) &&
        Boolean(resolved.projectDbId);

    return {
        ...resolved,
        isResolved,
        isLoading: Boolean(loading) && !isResolved,
        error: error || null,
    };
}

export default useCurrentProject;
