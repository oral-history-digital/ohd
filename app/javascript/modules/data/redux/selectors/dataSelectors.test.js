import dotProp from 'dot-prop-immutable';
import { DEFAULT_LOCALES } from 'modules/constants';

import {
    DEFAULT_MAP_SECTION,
    getCollectionsForCurrentProject,
    getCollectionsStatus,
    getContributionTypesForCurrentProject,
    getContributionsStatus,
    getContributorsFetched,
    getCurrentInterview,
    getCurrentInterviewFetched,
    getCurrentProject,
    getCurrentRefTree,
    getCurrentRefTreeStatus,
    getCurrentUser,
    getCurrentUserIsAdmin,
    getFlattenedRefTree,
    getGroupedContributions,
    getHeadings,
    getHeadingsFetched,
    getHeadingsStatus,
    getInterviewsStatus,
    getIsCampscapesProject,
    getIsCatalog,
    getLanguagesStatus,
    getMapSections,
    getMarkTextStatus,
    getMediaStreamsForCurrentProject,
    getPeopleStatus,
    getPermissionsStatus,
    getProjectLocales,
    getProjectTranslation,
    getProjectsStatus,
    getRefTreeStatus,
    getRegistryEntriesStatus,
    getRegistryNameTypesForCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
    getSegmentsStatus,
    getShowFeaturedInterviews,
    getShowStartPageVideo,
    getSpeakerDesignationsStatus,
    getTaskTypesForCurrentProject,
    getTaskTypesStatus,
    getTasksStatus,
    getTranscriptFetched,
    getUsersStatus,
} from './dataSelectors';
import {
    contributionState,
    interviewer,
    projectState,
    qualityManager,
    sound1,
    sound2,
    state,
} from './stateFixture';

/** Interview Tests */

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(getCurrentInterviewFetched(state)).toBe(true);
});

test('getHeadings gets headings object of current interview', () => {
    expect(getHeadings(state)).toEqual(state.data.interviews.cd003.headings);
});

describe('getTranscriptFetched', () => {
    test('returns true if transcript has been fetched', () => {
        expect(getTranscriptFetched(state)).toBeTruthy();
    });

    test('returns false if transcript has not been fetched', () => {
        const _state = dotProp.set(state, 'archive.archiveId', 'za085');
        expect(getTranscriptFetched(_state)).toBeFalsy();
    });
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(getContributorsFetched(state)).toBe(true);
});

test('getCurrentRefTree retrieves ref tree of current interview', () => {
    expect(getCurrentRefTree(state)).toEqual(
        state.data.interviews.cd003.ref_tree
    );
});

test('getFlattenedRefTree retrieves flattened version of ref tree', () => {
    const actual = getFlattenedRefTree(state);
    const expected = {
        11310: {
            id: 11310,
            type: 'node',
            children: [
                {
                    type: 'leafe',
                    time: 1472.18,
                    tape_nbr: 1,
                },
                {
                    type: 'leafe',
                    time: 2103.32,
                    tape_nbr: 1,
                },
            ],
        },
        11786: {
            id: 11786,
            type: 'node',
            children: [
                {
                    type: 'leafe',
                    time: 25.2,
                    tape_nbr: 1,
                },
            ],
        },
    };

    expect(actual).toEqual(expected);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

describe('getGroupedContributions', () => {
    test('returns contributions of current interview, ordered and grouped by type, without interviewee', () => {
        const actual = getGroupedContributions(contributionState);
        const expected = [
            {
                type: 'interviewer',
                contributions: [interviewer],
            },
            {
                type: 'sound',
                contributions: [sound1, sound2],
            },
        ];
        expect(actual).toEqual(expected);
    });

    test('also returns quality managers when edit view is true', () => {
        const _state = dotProp.set(contributionState, 'archive.editView', true);

        const actual = getGroupedContributions(_state);
        const expected = [
            {
                type: 'interviewer',
                contributions: [interviewer],
            },
            {
                type: 'sound',
                contributions: [sound1, sound2],
            },
            {
                type: 'quality_manager_transcription',
                contributions: [qualityManager],
            },
        ];
        expect(actual).toEqual(expected);
    });
});

/** Project Tests */

describe('getCurrentProject', () => {
    test("gets currently selected project's object", () => {
        expect(getCurrentProject(projectState)).toEqual(
            projectState.data.projects[1]
        );
    });

    test('returns null if project cannot be found', () => {
        const state = {
            archive: {
                projectId: 'cdoh',
            },
            data: {
                projects: {},
            },
        };

        expect(getCurrentProject(state)).toBeNull();
    });
});

describe('getShowFeaturedInterviews', () => {
    test('is false for mog project', () => {
        const _state = dotProp.set(projectState, 'archive.projectId', 'mog');

        expect(getShowFeaturedInterviews(_state)).toBeFalsy();
    });

    test('is false for campscapes project', () => {
        const _state = dotProp.set(
            projectState,
            'archive.projectId',
            'campscapes'
        );
        expect(getShowFeaturedInterviews(_state)).toBeFalsy();
    });

    test('is true otherwise', () => {
        expect(getShowFeaturedInterviews(projectState)).toBeTruthy();
    });
});

describe('getshowStartPageVideo', () => {
    test('is true for mog project', () => {
        const _state = dotProp.set(projectState, 'archive.projectId', 'mog');

        expect(getShowStartPageVideo(_state)).toBeTruthy();
    });

    test('is false otherwise', () => {
        expect(getShowStartPageVideo(projectState)).toBeFalsy();
    });
});

test('getProjectTranslation gets project translation for current locale', () => {
    const actual = getProjectTranslation(projectState);
    const expected = projectState.data.projects[1].translations_attributes[0];
    expect(actual).toEqual(expected);
});

describe('getIsCampscapesProject', () => {
    test('is true when set to campscapes', () => {
        const _state = dotProp.set(
            projectState,
            'archive.projectId',
            'campscapes'
        );

        expect(getIsCampscapesProject(_state)).toBeTruthy();
    });

    test('is false otherwise', () => {
        expect(getIsCampscapesProject(projectState)).toBeFalsy();
    });
});

describe('getIsCatalog', () => {
    test('returns is_catalog value', () => {
        expect(getIsCatalog(projectState)).toEqual(
            projectState.data.projects[1].is_catalog
        );
    });

    test('is false otherwise', () => {
        const _state = dotProp.set(
            projectState,
            'data.projects.1.is_catalog',
            null
        );

        expect(getIsCatalog(_state)).toBe(false);
    });
});

describe('getMapSections', () => {
    test('returns map sections as ordered array', () => {
        const actual = getMapSections(projectState);
        const expected = [
            {
                id: 2,
                type: 'MapSection',
                name: 'usa',
                order: 0,
            },
            {
                id: 1,
                type: 'MapSection',
                name: 'europe',
                order: 1,
            },
        ];
        expect(actual).toEqual(expected);
    });

    test('returns default section if map sections are blank', () => {
        const _state = dotProp.set(
            projectState,
            'data.projects.1.map_sections',
            {}
        );
        const actual = getMapSections(_state);
        const expected = [DEFAULT_MAP_SECTION];
        expect(actual).toEqual(expected);
    });

    test('returns default section if map sections is undefined', () => {
        const _state = dotProp.set(
            projectState,
            'data.projects.1.map_sections',
            undefined
        );
        const actual = getMapSections(_state);
        const expected = [DEFAULT_MAP_SECTION];
        expect(actual).toEqual(expected);
    });
});

describe('getProjectLocales', () => {
    test('gets project locales', () => {
        expect(getProjectLocales(projectState)).toEqual(
            projectState.data.projects[1].available_locales
        );
    });

    test('gets default locales if no project is selected', () => {
        const _state = dotProp.set(projectState, 'archive.projectId', null);
        expect(getProjectLocales(_state)).toEqual(DEFAULT_LOCALES);
    });
});

test('getCollectionsForCurrentProject gets collections object', () => {
    expect(getCollectionsForCurrentProject(projectState)).toEqual(
        projectState.data.projects[1].collections
    );
});

test('getTaskTypesForCurrentProject gets task_types object', () => {
    expect(getTaskTypesForCurrentProject(projectState)).toEqual(
        projectState.data.projects[1].task_types
    );
});

test('getRolesForCurrentProject gets roles object', () => {
    expect(getRolesForCurrentProject(projectState)).toEqual(
        projectState.data.projects[1].roles
    );
});

test('getMediaStreamsForCurrentProject retrieves media streams', () => {
    expect(getMediaStreamsForCurrentProject(projectState)).toEqual(
        projectState.data.projects[1].media_streams
    );
});

test('getContributionTypesForCurrentProject retrieves contributionTypes object', () => {
    expect(getContributionTypesForCurrentProject(projectState)).toEqual(
        projectState.data.projects[1].contribution_types
    );
});

/** Registry Tests */
test('getRegistryEntriesStatus gets registry entries status object', () => {
    expect(getRegistryEntriesStatus(state)).toEqual(
        state.data.statuses.registry_entries
    );
});

test('getRegistryNameTypesForCurrentProject gets registry name types object', () => {
    expect(getRegistryNameTypesForCurrentProject(state)).toEqual(
        state.data.registry_name_types
    );
});

/** Status Tests */

test('getUsersStatus gets users status object', () => {
    expect(getUsersStatus(state)).toEqual(state.data.statuses.users);
});

test('getCollectionsStatus gets collections status object', () => {
    expect(getCollectionsStatus(state)).toEqual(
        state.data.statuses.collections
    );
});

test('getContributionsStatus gets contributions status object', () => {
    expect(getContributionsStatus(state)).toEqual(
        state.data.statuses.contributions
    );
});

test('getHeadingsStatus gets headings status object', () => {
    expect(getHeadingsStatus(state)).toEqual(state.data.statuses.headings);
});

test('getHeadingsFetched gets if headings of current interview are fetched', () => {
    expect(getHeadingsFetched(state)).toBeTruthy();
});

test('getLanguagesStatus gets languages status object', () => {
    expect(getLanguagesStatus(state)).toEqual(state.data.statuses.languages);
});

test('getMarkTextStatus gets mark text status object', () => {
    expect(getMarkTextStatus(state)).toEqual(state.data.statuses.mark_text);
});

test('getPeopleStatus gets people status object', () => {
    expect(getPeopleStatus(state)).toEqual(state.data.statuses.people);
});

test('getPermissionsStatus gets permissions status object', () => {
    expect(getPermissionsStatus(state)).toEqual(
        state.data.statuses.permissions
    );
});

test('getProjectsStatus gets projects status object', () => {
    expect(getProjectsStatus(state)).toEqual(state.data.statuses.projects);
});

test('getInterviewsStatus gets interviews status object', () => {
    expect(getInterviewsStatus(state)).toEqual(state.data.statuses.interviews);
});

test('getRefTreeStatus gets ref tree status object', () => {
    expect(getRefTreeStatus(state)).toEqual(state.data.statuses.ref_tree);
});

describe('getCurrentRefTreeStatus', () => {
    it("is 'fetched' if ref tree has been loaded", () => {
        expect(getCurrentRefTreeStatus(state)).toBe('fetched');
    });

    it("is 'fetching' if ref tree is loading", () => {
        const _state = dotProp.set(
            state,
            'data.statuses.ref_tree.for_interviews_cd003',
            'fetching'
        );
        expect(getCurrentRefTreeStatus(_state)).toBe('fetching');
    });

    it("is 'n/a' otherwise", () => {
        const _state = dotProp.set(state, 'archive.archiveId', 'za053');
        expect(getCurrentRefTreeStatus(_state)).toBe('n/a');
    });
});

test('getRolesStatus gets roles status object', () => {
    expect(getRolesStatus(state)).toEqual(state.data.statuses.roles);
});

test('getSegmentsStatus gets segments status object', () => {
    expect(getSegmentsStatus(state)).toEqual(state.data.statuses.segments);
});

test('getSpeakerDesignationsStatus gets speaker designations status object', () => {
    expect(getSpeakerDesignationsStatus(state)).toEqual(
        state.data.statuses.speaker_designations
    );
});

test('getTasksStatus gets tasks status object', () => {
    expect(getTasksStatus(state)).toEqual(state.data.statuses.tasks);
});

test('getTaskTypesStatus gets task types status object', () => {
    expect(getTaskTypesStatus(state)).toEqual(state.data.statuses.task_types);
});

/** User Tests */

test('getCurrentUser gets user object of current user', () => {
    expect(getCurrentUser(state)).toEqual(state.data.users.current);
});

test('getCurrentUserIsAdmin gets admin status of current user', () => {
    expect(getCurrentUserIsAdmin(state)).toEqual(
        state.data.users.current.admin
    );
});
