import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

import { fetchData } from '../redux/actions';
import { getProjects, getProjectsStatus } from '../redux/selectors';

export const useLoadCompleteProject = (
    projectDbId,
    { enabled = true, fallbackProject = null } = {}
) => {
    const { locale } = useI18n();
    const { project: currentProject, projectId: currentProjectId } =
        useProject();
    const projects = useSelector(getProjects);
    const projectsStatus = useSelector(getProjectsStatus);
    const dispatch = useDispatch();
    const loadedProject = projects?.[projectDbId] || fallbackProject;

    useEffect(() => {
        if (!enabled || !projectDbId) {
            return;
        }

        const status = projectsStatus?.[projectDbId];
        const isFetched = /^fetched/.test(status || '');
        const isFetching = /^fetching/.test(status || '');

        if (!isFetched && !isFetching) {
            dispatch(
                fetchData(
                    {
                        locale,
                        projectId: currentProjectId,
                        project: currentProject,
                    },
                    'projects',
                    projectDbId
                )
            );
        }
    }, [
        currentProject,
        currentProjectId,
        dispatch,
        enabled,
        locale,
        projectDbId,
        projectsStatus,
    ]);

    return loadedProject;
};

export default useLoadCompleteProject;
