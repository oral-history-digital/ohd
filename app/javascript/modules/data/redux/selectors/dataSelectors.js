import shuffle from 'lodash.shuffle';
import { getArchiveId, getEditView, getProjectId } from 'modules/archive';
import { CONTRIBUTION_INTERVIEWEE } from 'modules/person';
import { findProjectByDomain } from 'modules/routes/domainUtils';
import { createSelector } from 'reselect';

import { getProjectIdentities } from '../projectDetails';
import {
    getInterviews,
    getProjects,
    getStatuses,
    getUsers,
} from './baseSelectors';

// Keep the fallback stable before a resource category has been requested.
const EMPTY_STATUSES = {};

/**
 * Basic Selectors others depend on
 **/

/**
 * Selects the current project's legacy nested resources using its routing identity.
 * Project display and editing data are read through useProject instead.
 *
 * @param {Object} state - Root Redux state.
 * @returns {Object|null} Nested-resource holder with its project ID, or null before identity resolves.
 */
export const getCurrentProject = createSelector(
    [getProjectId, getProjectIdentities, getProjects],
    (projectId, identities, projects) => {
        const identity =
            Object.values(identities).find(
                (project) => project.shortname === projectId
            ) || findProjectByDomain(identities);
        return identity ? { ...projects[identity.id], id: identity.id } : null;
    }
);

export const getCurrentInterview = createSelector(
    [getInterviews, getArchiveId],
    (interviews, archiveId) => {
        return interviews && interviews[archiveId];
    }
);

export const getUmbrellaProject = createSelector([getProjects], (projects) => {
    return Object.values(projects).find((project) => project.is_umbrella);
});

export const getPublicProjects = createSelector(
    getProjects,
    (projectObject) => {
        return Object.values(projectObject).filter(
            (project) => project.workflow_state === 'public'
        );
    }
);

export const getCurrentInterviewFetched = (state) => {
    const currentInterview = getCurrentInterview(state);

    return !(
        Object.is(currentInterview, undefined) ||
        Object.is(currentInterview, null)
    );
};

/**
 * User Selectors
 */

export const getCurrentUser = (state) => getUsers(state).current;

export const getCurrentUserIsAdmin = (state) => getCurrentUser(state).admin;

/**
 * Status Selectors
 */

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

export const getRolesStatus = (state) => getStatuses(state).roles;

export const getSegmentsStatus = (state) => getStatuses(state).segments;

export const getSpeakerDesignationsStatus = (state) =>
    getStatuses(state).speaker_designations;

export const getTasksStatus = (state) => getStatuses(state).tasks;

export const getTaskTypesStatus = (state) => getStatuses(state).task_types;

/**
 * Interview Selectors
 **/

export const getCurrentIntervieweeId = createSelector(
    getCurrentInterview,
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
    getCurrentInterview,
    (interview) => interview?.headings
);

export const getTranscriptFetched = createSelector(
    [getSegmentsStatus, getArchiveId],
    (segmentsStatus, archiveId) => {
        const isFetched = /^fetched/;
        return isFetched.test(segmentsStatus[`for_interviews_${archiveId}`]);
    }
);

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
        if (refTree?.umbrella) {
            flattenedTree = flattenTree(flattenedTree, refTree.umbrella);
        }
        // Handle case where refTree is the direct tree structure
        if (
            refTree &&
            !refTree.project &&
            !refTree.umbrella &&
            refTree.children
        ) {
            flattenedTree = flattenTree(flattenedTree, refTree);
        }

        return flattenedTree;
    }
);

/**
 * Project Selectors
 **/

export const DEFAULT_MAP_SECTION = {
    id: 0,
    type: 'MapSection',
    name: 'default',
    corner1_lat: 51.50939, // London
    corner1_lon: -0.11832,
    corner2_lat: 44.433333, // Bucarest
    corner2_lon: 26.1,
};

export const getContributionTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.contribution_types;
    }
);

export const getShowFeaturedInterviews = (state) => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    if (projectId === 'mog' || projectId === 'campscapes') {
        return false;
    }

    return true;
};

export const getShowStartPageVideo = (state) => {
    const projectId = getProjectId(state);

    // TODO: put to project-conf
    return projectId === 'mog';
};

export const getIsCampscapesProject = (state) => {
    const projectId = getProjectId(state);

    return projectId === 'campscapes';
};

export const getStartpageProjects = createSelector(
    [getPublicProjects],
    (projects) => {
        const projectsWithoutUmbrella = projects.filter(
            (project) => !project.is_umbrella
        );
        return shuffle(projectsWithoutUmbrella);
    }
);

export const getCollectionsForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.collections;
    }
);

export const getCollectionsForCurrentProjectFetched = createSelector(
    [getCollectionsStatus, getCurrentProject],
    (collectionsStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            collectionsStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getTaskTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.task_types;
    }
);

export const getTaskTypesForCurrentProjectFetched = createSelector(
    [getTaskTypesStatus, getCurrentProject],
    (taskTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            taskTypesStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getRolesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.roles;
    }
);

export const getRolesForCurrentProjectFetched = createSelector(
    [getRolesStatus, getCurrentProject],
    (rolesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(rolesStatus[`for_projects_${currentProject?.id}`]);
    }
);

/**
 * Registry Selectors
 **/

export const getRegistryEntriesStatus = (state) =>
    getStatuses(state).registry_entries;

export const getRegistryReferenceTypesStatus = (state) =>
    getStatuses(state).registry_reference_types;

export const getRegistryNameTypesStatus = (state) =>
    getStatuses(state)?.registry_name_types || EMPTY_STATUSES;

export const getContributionTypesStatus = (state) =>
    getStatuses(state)?.contribution_types || EMPTY_STATUSES;

export const getRootRegistryEntryReload = createSelector(
    [getRegistryEntriesStatus, getCurrentProject],
    (status, currentProject) => {
        const reload = /^reload/;
        return reload.test(status[currentProject.root_registry_entry_id]);
    }
);

export const getRegistryReferenceTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.registry_reference_types;
    }
);

export const getRegistryReferenceTypesForCurrentProjectFetched = createSelector(
    [getRegistryReferenceTypesStatus, getCurrentProject],
    (registryReferenceTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(
            registryReferenceTypesStatus[`for_projects_${currentProject?.id}`]
        );
    }
);

export const getRegistryNameTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.registry_name_types;
    }
);

/**
 * More dependent selectors
 **/

export const getContributorsFetched = createSelector(
    [getCurrentInterview, getPeopleStatus, getCurrentProject],
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

/**
 * Groups current interview contributions by visible type in the configured order.
 * Project access is supplied by the consumer's shared access hook.
 *
 * @param {Object} state - Root Redux state with interview and contribution-type records.
 * @param {boolean} projectAccessGranted - Whether the viewer has access to the loaded project.
 * @returns {Object[]|null} Ordered contribution groups, or null before records are available.
 */
export const getGroupedContributions = createSelector(
    [
        (state) => getEditView(state),
        (state) => getCurrentInterview(state),
        (state) => getContributionTypesForCurrentProject(state),
        (_state, projectAccessGranted) => Boolean(projectAccessGranted),
    ],
    (editView, currentInterview, contributionTypes, projectAccessGranted) => {
        if (
            !currentInterview ||
            !currentInterview.contributions ||
            !contributionTypes
        ) {
            return null;
        }

        const availableTypes = Object.values(contributionTypes)
            .filter(
                (ct) =>
                    editView ||
                    (projectAccessGranted && ct.use_in_details_view) ||
                    ct.display_on_landing_page
            )
            .sort((a, b) => a.order - b.order)
            .map((ct) => ct.code);

        const groupedContributions = Object.values(
            currentInterview.contributions
        )
            .filter((con) => availableTypes.includes(con.contribution_type))
            .reduce((acc, contribution) => {
                const type = contribution.contribution_type;

                if (!acc[type]) {
                    acc[type] = [contribution];
                } else {
                    acc[type].push(contribution);
                }

                return acc;
            }, {});

        const groupedAsArray = Object.keys(groupedContributions).map(
            (type) => ({
                type,
                contributions: groupedContributions[type],
            })
        );

        groupedAsArray.sort(
            (a, b) =>
                availableTypes.indexOf(a.type) - availableTypes.indexOf(b.type)
        );

        return groupedAsArray;
    }
);
