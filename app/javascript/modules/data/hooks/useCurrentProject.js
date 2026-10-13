import { useEffect, useMemo } from 'react';

import isLocaleValid from 'modules/routes/isLocaleValid';
import usePathBase from 'modules/routes/usePathBase';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import { fetchData } from '../redux/actions';
import {
    getProjectRepresentations,
    getProjectRequest,
    getProjects,
} from '../redux/selectors/baseSelectors';
import { resolveCurrentProject } from '../utils';

/**
 * Returns the current project from Redux. Set lite to false when details are needed.
 */
export function useCurrentProject({ lite = true } = {}) {
    const dispatch = useDispatch();
    const projects = useSelector(getProjects);
    const representations = useSelector(getProjectRepresentations);
    const matchWithProject = useMatch('/:projectId/:locale/*');
    const pathBase = usePathBase();
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
    const identifier = routeProjectShortname || cacheResolution.projectDbId;
    const props = useMemo(
        () => ({
            pathBase,
            locale: pathBase.split('/').pop(),
            project: {
                shortname:
                    routeProjectShortname || cacheResolution.projectShortname,
            },
        }),
        [pathBase, routeProjectShortname, cacheResolution.projectShortname]
    );
    const request = useSelector((state) =>
        getProjectRequest(state, props, identifier)
    );
    const hasDetails =
        representations[cacheResolution.projectDbId] === 'detail' &&
        request?.status === 'succeeded';
    const needsData =
        Boolean(identifier) &&
        (!cacheResolution.project || (!lite && !hasDetails));

    useEffect(() => {
        if (
            !needsData ||
            request?.status === 'pending' ||
            request?.status === 'failed'
        )
            return;
        dispatch(fetchData(props, 'projects', identifier));
    }, [dispatch, needsData, request?.status, identifier, props]);

    const isResolved = Boolean(
        cacheResolution.project &&
            cacheResolution.projectDbId &&
            cacheResolution.projectShortname
    );
    return {
        ...cacheResolution,
        project: !lite && !hasDetails ? null : cacheResolution.project,
        isResolved,
        isLoading: Boolean(needsData && !request?.error),
        error: request?.error || null,
    };
}

export default useCurrentProject;
