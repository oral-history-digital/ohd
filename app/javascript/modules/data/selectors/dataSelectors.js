import { createSelector } from 'reselect';
import shuffle from 'lodash.shuffle';

import { getArchiveId, getProjectId, getLocale  } from 'modules/archive';
import { CONTRIBUTION_INTERVIEWEE } from 'modules/person';
import { DEFAULT_LOCALES, ALPHA2_TO_ALPHA3 } from 'modules/constants';

export const getData = state => state.data;

export const getLanguages = state => getData(state).languages;

export const getTranslationValues = state => getData(state).translation_values;

export const getInstitutions = state => getData(state).institutions;

export const getProjects = state => getData(state).projects;

export const getPublicProjects = createSelector(
    getProjects,
    projectObject => {
        return Object.values(projectObject)
            .filter(project => project.workflow_state === 'public');
    }
);



export const getCollections = state => getData(state).collections;

export const getNormDataProviders = state => getData(state).norm_data_providers;

export const getInterviews = state => getData(state).interviews;

export const getUsers = state => getData(state).users;

export const getCurrentUser = state => getUsers(state).current;

export const getPermissions = state => getData(state).permissions;

export const getRegistryEntries = state => getData(state).registry_entries;

export const getSegments = state => getData(state).segments;

export const getTasks = state => getData(state).tasks;

export const getRandomFeaturedInterviews = state => getData(state).random_featured_interviews;

export const getCurrentUserIsAdmin = state => getCurrentUser(state).admin;

/* Statuses */

export const getStatuses = state => getData(state).statuses;

export const getUsersStatus = state => getStatuses(state).users;

export const getCollectionsStatus = state => getStatuses(state).collections;

export const getContributionsStatus = state => getStatuses(state).contributions;

export const getHeadingsStatus = state => getStatuses(state).headings;

export const getHeadingsFetched = createSelector(
    [getHeadingsStatus, getArchiveId],
    (headingsStatus, archiveId) => {
        const status = headingsStatus[`for_interviews_${archiveId}`];
        const isFetched = /^fetched/;
        return isFetched.test(status);
    }
);

export const getLanguagesStatus = state => getStatuses(state).languages;

export const getTranslationValuesStatus = state => getStatuses(state).translation_values;

export const getInstitutionsStatus = state => getStatuses(state).institutions;

export const getMarkTextStatus = state => getStatuses(state).mark_text;

export const getPeopleStatus = state => getStatuses(state).people;

export const getPermissionsStatus = state => getStatuses(state).permissions;

export const getInterviewsStatus = state => getStatuses(state).interviews;

export const getProjectsStatus = state => getStatuses(state).projects;

export const getRefTreeStatus = state => getStatuses(state).ref_tree;

export const getCurrentRefTreeStatus = createSelector(
    [getRefTreeStatus, getArchiveId],
    (refTreeStatus, archiveId) => {
        const status = refTreeStatus[`for_interviews_${archiveId}`];

        const isFetched =  /^fetched/;
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

export const getRegistryEntriesStatus = state => getStatuses(state).registry_entries;

export const getRegistryReferenceTypesStatus = state => getStatuses(state).registry_reference_types;

export const getRegistryNameTypesStatus = state => getStatuses(state).registry_reference_types;

export const getContributionTypesStatus = state => getStatuses(state).registry_reference_types;

export const getRolesStatus = state => getStatuses(state).roles;

export const getSegmentsStatus = state => getStatuses(state).segments;

export const getSpeakerDesignationsStatus = state => getStatuses(state).speaker_designations;

export const getTasksStatus = state => getStatuses(state).tasks;

export const getTaskTypesStatus = state => getStatuses(state).task_types;

function projectByDomain(projects) {
    return projects && Object.values(projects).find(
        project => project.archive_domain === window.location.origin
    );
}

export const getCurrentProject = createSelector(
    [getProjectId, getProjects],
    (projectId, projects) => {
        const currentProject = Object.values(projects).find(project => project.shortname === projectId) ||
            projectByDomain(projects);

        return currentProject || null;
    }
);

export const getOHDProject = createSelector(
    [getProjects],
    (projects) => {
        return Object.values(projects).find(project => project.shortname === 'ohd');
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

export const getCurrentRefTree = state => getCurrentInterview(state)?.ref_tree;

export const getFlattenedRefTree = createSelector(
    getCurrentRefTree,
    refTree => {
        if (!refTree) {
            return null;
        }

        /*
        * Flattened tree only contains nodes with direct children, not all nodes.
        */
        function flattenTree(acc, node) {
            const children = node.children;

            children?.forEach(child => {
                if (child.type === 'node') {
                    flattenTree(acc, child);
                }
            })

            const hasLeaves = children?.some(child => child.type === 'leafe');

            if (hasLeaves) {
                const clonedNode = {
                    ...node,
                    children: node.children.filter(child => child.type === 'leafe'),
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

const getOriginalLocaleFromProps = (_, props) => props.originalLocale;

export const getTranscriptLocale = createSelector(
    [getCurrentInterview, getOriginalLocaleFromProps],
    (interview, originalLocale) => {
        if (!interview) {
            return undefined;
        }

        const firstTranslationLocale = interview.translation_locale;
        const locale = originalLocale ? interview.alpha3 : firstTranslationLocale;
        return locale;
    }
);

export const getHasTranscript = createSelector(
    [getCurrentInterview, getTranscriptLocale],
    (interview, locale) => {
        if (!interview || !locale) {
            return false;
        }

        const segmentsOfFirstTape = interview.segments?.[1];

        if (!segmentsOfFirstTape) {
            return false;
        }

        const segmentArray = Object.values(segmentsOfFirstTape);

        const result = segmentArray.some((segment) =>
            segment.text[locale] || segment.text[`${locale}-public`]
        );

        return result;
    }
);

export const getContributorsFetched = createSelector(
    [getCurrentInterview, getPeopleStatus, getCurrentProject],
    (interview, peopleStatus, currentProject) => {
        const fetched = /^fetched/;
        if (
            interview &&
            (
                fetched.test(peopleStatus[`for_projects_${currentProject?.id}`]) ||
                fetched.test(peopleStatus[`contributors_for_interview_${interview.id}`])
            )
        ) {
            return true;
        } else {
            return false;
        }
    }
);

export const getRootRegistryEntryReload = createSelector(
    [getRegistryEntriesStatus, getCurrentProject],
    (status, currentProject) => {
        const reload = /^reload/;
        return reload.test(status[currentProject.root_registry_entry_id]);
    }
);

export const getProjectLocales = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject ?
            currentProject.available_locales :
            DEFAULT_LOCALES;
    }
);

export const getStartpageProjects = createSelector(
    [getPublicProjects],
    (projects) => {
        const projectsWithoutOhd = projects.filter((project) => !project.is_ohd);
        return shuffle(projectsWithoutOhd);
    }
);

export const getCollectionsForCurrentProjectFetched = createSelector(
    [getCollectionsStatus, getCurrentProject],
    (collectionsStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(collectionsStatus[`for_projects_${currentProject?.id}`]);
    }
);

export const getCollectionsForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.collections;
    }
);

export const getTaskTypesForCurrentProjectFetched = createSelector(
    [getTaskTypesStatus, getCurrentProject],
    (taskTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(taskTypesStatus[`for_projects_${currentProject?.id}`]);
    }
);

export const getTaskTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.task_types;
    }
);

export const getRolesForCurrentProjectFetched = createSelector(
    [getRolesStatus, getCurrentProject],
    (rolesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(rolesStatus[`for_projects_${currentProject?.id}`]);
    }
);

export const getRolesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.roles;
    }
);

export const getRegistryReferenceTypesForCurrentProjectFetched = createSelector(
    [getRegistryReferenceTypesStatus, getCurrentProject],
    (registryReferenceTypesStatus, currentProject) => {
        const fetched = /^fetched/;
        return fetched.test(registryReferenceTypesStatus[`for_projects_${currentProject?.id}`]);
    }
);

export const getRegistryReferenceTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.registry_reference_types;
    }
);

export const getRegistryNameTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.registry_name_types;
    }
);

export const getMediaStreamsForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.media_streams;
    }
);

export const getContributionTypesForCurrentProject = createSelector(
    [getCurrentProject],
    (currentProject) => {
        return currentProject?.contribution_types;
    }
);

export const getCurrentIntervieweeId = createSelector(
    getCurrentInterview,
    interview => {
        if (!interview?.contributions) {
            return undefined;
        }

        const intervieweeContribution = Object.values(interview.contributions)
            .find(c => c.contribution_type === CONTRIBUTION_INTERVIEWEE);

        if (!intervieweeContribution) {
            return null;
        }

        return intervieweeContribution.person_id;
    }
);

export const getHeadings = createSelector(
    getCurrentInterview,
    interview => interview?.headings
);

export const getPreparedHeadings = createSelector(
    [getCurrentInterview, getLocale],
    (interview, locale) => {
        let mainIndex = 0;
        let mainheading = '';
        let subIndex = 0;
        let subheading = '';
        let headings = [];
        let lastMainheading = '';
        const alpha3 = ALPHA2_TO_ALPHA3[locale];

        if (interview?.headings) {
            Object.values(interview.headings).sort(function(a, b) {return a.tape_nbr - b.tape_nbr || a.time - b.time}).map((segment, index) => {
                mainheading = segment.mainheading[alpha3] ||
                    segment.mainheading[`${alpha3}-public`]
                subheading = segment.subheading[alpha3] ||
                    segment.subheading[`${alpha3}-public`]
                //
                // if the table of content looks different in languages with different alphabets, have a look to the following and extend the regexp:
                // https://stackoverflow.com/questions/18471159/regular-expression-with-the-cyrillic-alphabet
                //
                // JavaScript (at least the versions most widely used) does not fully support Unicode.
                // That is to say, \w matches only Latin letters, decimal digits, and underscores ([a-zA-Z0-9_])
                //
                if (mainheading && /[\w\u0430-\u044f0-9]+/.test(mainheading) && mainheading !== lastMainheading) {
                    mainIndex += 1;
                    subIndex = 0;
                    lastMainheading = mainheading;
                    // TODO: segment should not be part of the headings object - we need it for editing, but there
                    // should be a leaner solution
                    headings.push({
                        segment: segment,
                        main: true,
                        chapter: mainIndex + '.',
                        heading: mainheading,
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        duration: interview.duration,
                        subheadings: []
                    });
                    if (headings.length > 1) {
                        if (index < interview.headings.length) {
                            // set previous heading's next_time attribute to this segment's time
                            if (headings[headings.length - 2].tape_nbr == segment.tape_nbr) {
                                headings[headings.length - 2].next_time = segment.time;
                            }
                        }
                        if (headings[headings.length - 2].subheadings.length > 0) {
                            // set previous subheading's next_time attribute to this segment's time
                            if (!headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time) {
                                if (headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].tape_nbr == segment.tape_nbr) {
                                    headings[headings.length - 2].subheadings[headings[headings.length - 2].subheadings.length - 1].next_time = segment.time;
                                }
                            }
                        }
                    }
                }
                if (subheading && /[\w\u0430-\u044f0-9]+/.test(subheading)) {
                    subIndex += 1;
                    if (headings[mainIndex - 1]) {
                        headings[mainIndex - 1].subheadings.push({
                            segment: segment,
                            main: false,
                            heading: subheading,
                            chapter: mainIndex + '.' + subIndex + '.',
                            time: segment.time,
                            tape_nbr: segment.tape_nbr,
                            duration: interview.duration
                        });
                        if (headings[mainIndex - 1].subheadings.length > 1) {
                            if (index < (interview.headings.length)) {
                                if (headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].tape_nbr == segment.tape_nbr) {
                                    headings[mainIndex - 1].subheadings[headings[mainIndex - 1].subheadings.length - 2].next_time = segment.time;
                                }
                            }
                        }
                    } else {
                        console.log(`segment ${segment.id} with alpha3 ${alpha3} tries to add a subheading to headings with index ${mainIndex -1}`);
                        console.log(`There are ${headings.length} headings at this point`);
                    }
                }
            })
        }
        return headings;
    }
);
