import { getArchiveId, getProjectId  } from './archiveSelectors';

export const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getPeople = state => getData(state).people;

export const getStatuses = state => getData(state).statuses;

export const getPeopleStatus = state => getStatuses(state).people;

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

export function getCurrentProject(state) {
    const currentProjectId = getProjectId(state);
    const projects = getProjects(state);

    const currentProject = Object.values(projects)
        .find(project => project.identifier === currentProjectId);

    return currentProject || null;
}

export const getCurrentInterview = state => {
    const interviews = getInterviews(state);
    const archiveId = getArchiveId(state);
    return interviews && interviews[archiveId];
};

export const getCurrentInterviewFetched = state => {
    const currentInterview = getCurrentInterview(state);

    return !(Object.is(currentInterview, undefined) || Object.is(currentInterview, null));
};

export const getContributorsFetched = state => {
    const interview = getCurrentInterview(state);
    const peopleStatus = getPeopleStatus(state);

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
};

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
