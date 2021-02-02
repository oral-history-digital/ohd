import { createSelector } from 'reselect';

import { projectByDomain } from 'lib/utils';

import { getArchiveId, getProjectId  } from 'modules/archive';

export const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getPeople = state => getData(state).people;

export const getStatuses = state => getData(state).statuses;

export const getPeopleStatus = state => getStatuses(state).people;

export const getInterviewsStatus = state => getStatuses(state).interviews;

export const getRegistryEntriesStatus = state => getStatuses(state).registry_entries;

export const getCollections = state => getData(state).collections;

export const getProjects = state => getData(state).projects;

export const getInterviews = state => getData(state).interviews;

export const getAccounts = state => getData(state).accounts;

export const getCurrentAccount = state => getAccounts(state).current;

export const getRegistryEntries = state => getData(state).registry_entries;

export const getRegistryNameTypes = state => getData(state).registry_name_types;

export const getTaskTypes = state => getData(state).task_types;

export const getUserContents = state => getData(state).user_contents;

export const getRandomFeaturedInterviews = state => getData(state).random_featured_interviews;

export const getCurrentUserIsAdmin = state => getCurrentAccount(state).admin;

export const get = (state, dataType, id) => getData(state)[dataType][id];

export const getCurrentProject = createSelector(
    [getProjectId, getProjects],
    (projectId, projects) => {
        const currentProject = projectByDomain(projects) ||
            Object.values(projects).find(project => project.identifier === projectId);

        return currentProject || null;
    }
);

export const getCurrentInterview = createSelector(
    [getInterviews, getArchiveId],
    (interviews, archiveId) => {
        return (interviews && interviews[archiveId]);
    }
);

export const getCurrentInterviewFetched = state => {
    const currentInterview = getCurrentInterview(state);

    return !(Object.is(currentInterview, undefined) || Object.is(currentInterview, null));
};

export const getContributorsFetched = createSelector(
    [getCurrentInterview, getPeopleStatus],
    (interview, peopleStatus) => {
        if (
            interview &&
            (
                (peopleStatus[`contributors_for_interview_${interview.id}`] && peopleStatus[`contributors_for_interview_${interview.id}`].split('-')[0] === 'fetched') ||
                (peopleStatus.all && peopleStatus.all.split('-')[0] === 'fetched')
            )
        ) {
            return true;
        } else {
            return false;
        }
    }
);

export const getFeaturedInterviewsArray = state => {
    const interviews = getRandomFeaturedInterviews(state);

    if (!interviews) {
        return [];
    }

    return Object.values(interviews);
}

export const getFeaturedInterviewsFetched = state => {
    const status = getStatuses(state).random_featured_interviews.all;
    const fetched = /^fetched/;

    return fetched.test(status);
};

export const getRootRegistryEntryFetched = createSelector(
    [getRegistryEntriesStatus, getCurrentProject],
    (status, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(status[currentProject.root_registry_entry_id]);
    }
);

export const getRootRegistryEntry = createSelector(
    [getRegistryEntries, getCurrentProject],
    (registryEntries, currentProject) => {
        return registryEntries[currentProject.root_registry_entry_id];
    }
);
