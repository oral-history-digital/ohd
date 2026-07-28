import { useEffect } from 'react';

import { RECEIVE_DATA, getProjects } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';

import useGetProjects from './useGetProjects';

/**
 * Loads the lightweight list of all projects and backfills the ones missing
 * from the Redux store, so that components reading `getProjects` see every
 * project instead of only those fetched earlier by chance.
 *
 * @param {Object} options
 * @param {boolean} options.enabled - Skip fetching when false.
 * @param {boolean} options.includeUmbrella - Include the OHD project in the list.
 */
export function useHydrateAllProjects({
    enabled = true,
    includeUmbrella = false,
} = {}) {
    const dispatch = useDispatch();
    const existingProjects = useSelector(getProjects);
    const { projects, isLoading } = useGetProjects({
        all: true,
        enabled,
        includeUmbrella,
    });

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            return;
        }

        const projectsById = projects.reduce((acc, project) => {
            if (project?.id !== undefined && project?.id !== null) {
                // Keep richer project objects already in Redux (for example from
                // initial bootstrap or per-project hydration) and only backfill
                // missing entries.
                if (existingProjects?.[project.id]) {
                    return acc;
                }

                acc[project.id] = {
                    ...project,
                    // Legacy admin hooks rely on `data.type` (e.g. useSensitiveData).
                    // `/projects/list` payload doesn't provide it, so add a compatible fallback.
                    type: project.type || 'Project',
                };
            }
            return acc;
        }, {});

        if (Object.keys(projectsById).length === 0) {
            return;
        }

        dispatch({
            type: RECEIVE_DATA,
            dataType: 'projects',
            data: projectsById,
        });
    }, [dispatch, existingProjects, projects]);

    return { isLoading };
}

export default useHydrateAllProjects;
