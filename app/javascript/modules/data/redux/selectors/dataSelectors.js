import shuffle from 'lodash.shuffle';
import { getArchiveId } from 'modules/archive';
import { DEFAULT_LOCALES } from 'modules/constants';
import { CONTRIBUTION_INTERVIEWEE } from 'modules/person';
import { createSelector } from 'reselect';
import {
    getCurrentInterview,
    getCurrentProject,
    getData,
    getProjects,
    getPublicProjects,
} from './baseSelectors';

export const getLanguages = (state) => getData(state).languages;

export const getTranslationValues = (state) =>
    getData(state).translation_values;

export const getInstitutions = (state) => getData(state).institutions;

export const getCollections = (state) => getData(state).collections;

export const getNormDataProviders = (state) =>
    getData(state).norm_data_providers;

export const getUsers = (state) => getData(state).users;

export const getCurrentUser = (state) => getUsers(state).current;

export const getPermissions = (state) => getData(state).permissions;

export const getRegistryEntries = (state) => getData(state).registry_entries;

export const getSegments = (state) => getData(state).segments;

export const getTasks = (state) => getData(state).tasks;

export const getRandomFeaturedInterviews = (state) =>
    getData(state).random_featured_interviews;

export const getCurrentUserIsAdmin = (state) => getCurrentUser(state).admin;

/* Statuses */

export const getStatuses = (state) => getData(state).statuses;

export const getUsersStatus = (state) => getStatuses(state).users;

export const getCollectionsStatus = (state) => getStatuses(state).collections;

export const getContributionsStatus = (state) =>
    getStatuses(state).contributions;

export const getHeadingsStatus = (state) => getStatuses(state).headings;

export const getHeadingsFetched = createSelector(
    [getHeadingsStatus, getArchiveId],
    (headingsStatus, archiveId) => {
        const status = headingsStatus[`for_interviews_${archiveId}`];
        const isFetched = /^fetched/;
        return isFetched.test(status);
    }
);

export const getLanguagesStatus = (state) => getStatuses(state).languages;

export const getTranslationValuesStatus = (state) =>
    getStatuses(state).translation_values;

export const getInstitutionsStatus = (state) => getStatuses(state).institutions;

export const getMarkTextStatus = (state) => getStatuses(state).mark_text;

export const getPeopleStatus = (state) => getStatuses(state).people;

export const getPermissionsStatus = (state) => getStatuses(state).permissions;

export const getInterviewsStatus = (state) => getStatuses(state).interviews;

export const getProjectsStatus = (state) => getStatuses(state).projects;

export const getRefTreeStatus = (state) => getStatuses(state).ref_tree;

export const getCurrentRefTreeStatus = createSelector(
    [getRefTreeStatus, getArchiveId],
    (refTreeStatus, archiveId) => {
        const status = refTreeStatus[`for_interviews_${archiveId}`];

        const isFetched = /^fetched/;
        const isFetching = /^fetching/;

        if (isFetched.test(status)) {
            return 'fetched';
        } else if (isFetching.test(status)) {
            return 'fetching';
        } else {
            return 'n/a';
        }
    }
);

export const getRegistryEntriesStatus = (state) =>
    getStatuses(state).registry_entries;

export const getRegistryReferenceTypesStatus = (state) =>
    getStatuses(state).registry_reference_types;

export const getRegistryNameTypesStatus = (state) =>
    getStatuses(state).registry_reference_types;

export const getContributionTypesStatus = (state) =>
    getStatuses(state).registry_reference_types;

export const getRolesStatus = (state) => getStatuses(state).roles;

export const getSegmentsStatus = (state) => getStatuses(state).segments;

export const getSpeakerDesignationsStatus = (state) =>
    getStatuses(state).speaker_designations;

export const getTasksStatus = (state) => getStatuses(state).tasks;

export const getTaskTypesStatus = (state) => getStatuses(state).task_types;

export const getOHDProject = (state) => {
    const projects = getProjects(state) || {};
    return Object.values(projects).find(
        (project) => project.shortname === 'ohd'
    );
};

export const getCurrentInterviewFetched = (state) => {
    const currentInterview = getCurrentInterview(state);

    return !(
        Object.is(currentInterview, undefined) ||
        Object.is(currentInterview, null)
    );
};

export const getCurrentRefTree = (state) =>
    getCurrentInterview(state)?.ref_tree;

export const getFlattenedRefTree = createSelector(
    getCurrentRefTree,
    (refTree) => {
        if (!refTree) {
            return null;
        }

        /*
         * Flattened tree only contains nodes with direct children, not all nodes.
         */
        function flattenTree(acc, node) {
            const children = node.children;

            children?.forEach((child) => {
                if (child.type === 'node') {
                    flattenTree(acc, child);
                }
            });

            const hasLeaves = children?.some((child) => child.type === 'leafe');

            if (hasLeaves) {
                const clonedNode = {
                    ...node,
                    children: node.children.filter(
                        (child) => child.type === 'leafe'
                    ),
                };

                acc[clonedNode.id] = clonedNode;
            }

            return acc;
        }

        let flattenedTree = {};
        if (refTree?.project) {
            flattenedTree = flattenTree(flattenedTree, refTree.project);
        }
        if (refTree?.ohd) {
            flattenedTree = flattenTree(flattenedTree, refTree.ohd);
        }
        // Handle case where refTree is the direct tree structure
        if (refTree && !refTree.project && !refTree.ohd && refTree.children) {
            flattenedTree = flattenTree(flattenedTree, refTree);
        }

        return flattenedTree;
    }
);

export const getTranscriptFetched = createSelector(
    [getSegmentsStatus, getArchiveId],
    (segmentsStatus, archiveId) => {
        const isFetched = /^fetched/;
        return isFetched.test(segmentsStatus[`for_interviews_${archiveId}`]);
    }
);

export const getContributorsFetched = createSelector(
    [
        (state) => getCurrentInterview(state),
        (state) => getPeopleStatus(state),
        (state) => getCurrentProject(state),
    ],
    (interview, peopleStatus, currentProject) => {
        const fetched = /^fetched/;
        if (
            interview &&
            (fetched.test(peopleStatus[`for_projects_${currentProject?.id}`]) ||
                fetched.test(
                    peopleStatus[`contributors_for_interview_${interview.id}`]
                ))
        ) {
            return true;
        } else {
            return false;
        }
    }
);

export const getRootRegistryEntryReload = createSelector(
    [getRegistryEntriesStatus, (state) => getCurrentProject(state)],
    (status, currentProject) => {
        const reload = /^reload/;
        return reload.test(status[currentProject.root_registry_entry_id]);
    }
);

export const getProjectLocales = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject
            ? currentProject.available_locales
            : DEFAULT_LOCALES;
    }
);

export const getStartpageProjects = createSelector(
    [(state) => getPublicProjects(state)],
    (projects) => {
        const projectsWithoutOhd = projects.filter(
            (project) => !project.is_ohd
        );
        return shuffle(projectsWithoutOhd);
    }
);

export const getCollectionsForCurrentProjectFetched = createSelector(
    [getCollectionsStatus, (state) => getCurrentProject(state)],
    (collectionsStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            collectionsStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getCollectionsForCurrentProject = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject?.collections;
    }
);

export const getTaskTypesForCurrentProjectFetched = createSelector(
    [getTaskTypesStatus, (state) => getCurrentProject(state)],
    (taskTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            taskTypesStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getTaskTypesForCurrentProject = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject?.task_types;
    }
);

export const getRolesForCurrentProjectFetched = createSelector(
    [getRolesStatus, (state) => getCurrentProject(state)],
    (rolesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(rolesStatus[`for_projects_${currentProject?.id}`]);
    }
);

export const getRolesForCurrentProject = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject?.roles;
    }
);

export const getRegistryReferenceTypesForCurrentProjectFetched = createSelector(
    [getRegistryReferenceTypesStatus, (state) => getCurrentProject(state)],
    (registryReferenceTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            registryReferenceTypesStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getRegistryReferenceTypesForCurrentProject = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject?.registry_reference_types;
    }
);

export const getRegistryNameTypesForCurrentProject = (state) =>
    getData(state).registry_name_types;

export const getMediaStreamsForCurrentProject = createSelector(
    [(state) => getCurrentProject(state)],
    (currentProject) => {
        return currentProject?.media_streams ?? null;
    }
);

export const getCurrentIntervieweeId = createSelector(
    [(state) => getCurrentInterview(state)],
    (interview) => {
        if (!interview?.contributions) {
            return undefined;
        }

        const intervieweeContribution = Object.values(
            interview.contributions
        ).find((c) => c.contribution_type === CONTRIBUTION_INTERVIEWEE);

        if (!intervieweeContribution) {
            return null;
        }

        return intervieweeContribution.person_id;
    }
);

export const getHeadings = createSelector(
    [(state) => getCurrentInterview(state)],
    (interview) => interview?.headings
);
