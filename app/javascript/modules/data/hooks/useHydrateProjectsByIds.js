import { useEffect, useRef } from 'react';

import {
    fetchData,
    getCurrentProject,
    getProjects,
    getProjectsStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

const DEFAULT_NEEDS_HYDRATION = (project) => !project;

/**
 * Hydrates projects in the Redux store by their IDs.
 *
 * @param {Array<number|string>} projectIds - The IDs of the projects to hydrate.
 * @param {Object} options
 * @param {(project: Object|undefined) => boolean} options.needsHydration -
 *        Optional predicate to request hydration even when a lightweight project
 *        object is already present in the store.
 */
export function useHydrateProjectsByIds(
    projectIds = [],
    { needsHydration = DEFAULT_NEEDS_HYDRATION } = {}
) {
    const attemptedHydrationIds = useRef(new Set());
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const currentProject = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const projectsStatus = useSelector(getProjectsStatus);

    useEffect(() => {
        if (!currentProject) {
            return;
        }

        const uniqueIds = [...new Set(projectIds)].filter(Boolean);

        uniqueIds.forEach((id) => {
            const projectId = Number(id);
            const projectIdStr = String(id);
            const status =
                projectsStatus?.[projectIdStr] || projectsStatus?.[projectId];
            const project = projects?.[projectId];
            const hasAttemptedHydration =
                attemptedHydrationIds.current.has(projectIdStr);

            if (
                needsHydration(project) &&
                !hasAttemptedHydration &&
                !/^fetching/.test(status || '')
            ) {
                // Mark the project ID as attempted for hydration
                attemptedHydrationIds.current.add(projectIdStr);
                dispatch(
                    fetchData(
                        { locale, project: currentProject },
                        'projects',
                        projectId
                    )
                );
            }
        });
    }, [
        currentProject,
        dispatch,
        locale,
        needsHydration,
        projectIds,
        projects,
        projectsStatus,
    ]);
}

export default useHydrateProjectsByIds;
