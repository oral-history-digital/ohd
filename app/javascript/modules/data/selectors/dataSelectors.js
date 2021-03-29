import { createSelector } from 'reselect';

import { getArchiveId, getProjectId  } from 'modules/archive';

export const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getMediaStreams = state => getData(state).media_streams;

export const getContributionTypes = state => getData(state).contribution_types;

export const getPeople = state => getData(state).people;

export const getCollections = state => getData(state).collections;

export const getProjects = state => getData(state).projects;

export const getInterviews = state => getData(state).interviews;

export const getAccounts = state => getData(state).accounts;

export const getCurrentAccount = state => getAccounts(state).current;

export const getRegistryEntries = state => getData(state).registry_entries;

export const getRegistryReferenceTypes = state => getData(state).registry_reference_types;

export const getRegistryNameTypes = state => getData(state).registry_name_types;

export const getTaskTypes = state => getData(state).task_types;

export const getUserContents = state => getData(state).user_contents;

export const getRandomFeaturedInterviews = state => getData(state).random_featured_interviews;

export const getCurrentUserIsAdmin = state => getCurrentAccount(state).admin;

/* Statuses */

export const getStatuses = state => getData(state).statuses;

export const getAccountsStatus = state => getStatuses(state).accounts;

export const getCollectionsStatus = state => getStatuses(state).collections;

export const getContributionsStatus = state => getStatuses(state).contributions;

export const getHeadingsStatus = state => getStatuses(state).headings;

export const getLanguagesStatus = state => getStatuses(state).languages;

export const getMarkTextStatus = state => getStatuses(state).mark_text;

export const getPeopleStatus = state => getStatuses(state).people;

export const getPermissionsStatus = state => getStatuses(state).permissions;

export const getInterviewsStatus = state => getStatuses(state).interviews;

export const getProjectsStatus = state => getStatuses(state).projects;

export const getRefTreeStatus = state => getStatuses(state).ref_tree;

export const getRegistryEntriesStatus = state => getStatuses(state).registry_entries;

export const getRegistryReferenceTypesStatus = state => getStatuses(state).registry_reference_types;

export const getRolesStatus = state => getStatuses(state).roles;

export const getSegmentsStatus = state => getStatuses(state).segments;

export const getSpeakerDesignationsStatus = state => getStatuses(state).speaker_designations;

export const getTasksStatus = state => getStatuses(state).tasks;

export const getTaskTypesStatus = state => getStatuses(state).task_types;

export const getUserContentsStatus = state => getStatuses(state).user_contents;

export const getUserRegistrationsStatus = state => getStatuses(state).user_registrations;


function projectByDomain(projects) {
    return projects && Object.values(projects).find(
        project => project.archive_domain === window.location.origin
    );
}

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

export const getCurrentInterviewee = createSelector(
    [getCurrentInterview, getPeople],
    (interview, people) => {
        if (interview?.contributions && people) {
            const intervieweeContribution = Object.values(interview.contributions)
                .find(c => c.contribution_type === 'interviewee');
            return people[intervieweeContribution?.person_id];
        }
    }
);

const getInterviewFromProps = (_, props) =>
    props.interview;

// Eventually, only use getCurrentInterviewee above.
export const getInterviewee = createSelector(
    [getInterviewFromProps, getPeople],
    (interview, people) => {
        if (interview?.contributions && people) {
            const intervieweeContribution = Object.values(interview.contributions)
                .find(c => c.contribution_type === 'interviewee');
            return people[intervieweeContribution?.person_id];
        }
    }
);

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

export const getRegistryReferenceTypesFetched = state => {
    const status = getStatuses(state).registry_reference_types.all;
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

export const getRootRegistryEntryReload = createSelector(
    [getRegistryEntriesStatus, getCurrentProject],
    (status, currentProject) => {
        const reload = /^reload/;
        return reload.test(status[currentProject.root_registry_entry_id]);
    }
);
