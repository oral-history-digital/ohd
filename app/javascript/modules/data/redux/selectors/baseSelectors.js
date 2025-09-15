import { getArchiveId, getProjectId } from 'modules/archive';
import { createSelector } from 'reselect';

export const getData = (state) => state.data;

export const getProjects = (state) => getData(state).projects;

export const getPublicProjects = createSelector(
    [getProjects],
    (projectObject) => {
        return Object.values(projectObject).filter(
            (project) => project.workflow_state === 'public'
        );
    }
);

export const getInterviews = (state) => getData(state).interviews;

export const getContributionTypes = (state) =>
    getData(state).contribution_types;

function projectByDomain(projects) {
    return (
        projects &&
        Object.values(projects).find(
            (project) => project.archive_domain === window.location.origin
        )
    );
}

export const getCurrentProject = createSelector(
    [getProjectId, getProjects],
    (projectId, projects) => {
        if (!projects) {
            return null;
        }

        const currentProject =
            Object.values(projects).find(
                (project) =>
                    project.shortname === projectId ||
                    project.identifier === projectId
            ) || projectByDomain(projects);

        return currentProject || null;
    }
);

export const getCurrentInterview = createSelector(
    [getInterviews, getArchiveId],
    (interviews, archiveId) => {
        return interviews && interviews[archiveId];
    }
);

export const getContributionTypesForCurrentProject = createSelector(
    [getCurrentProject, getContributionTypes],
    (currentProject, globalContributionTypes) => {
        return (
            currentProject?.contribution_types || globalContributionTypes || {}
        );
    }
);
