import dotProp from 'dot-prop-immutable';
import { DEFAULT_LOCALES } from 'modules/constants';
import {
    getCollectionsForCurrentProject,
    getCollectionsStatus,
    getContributionsStatus,
    getContributorsFetched,
    getCurrentInterviewFetched,
    getCurrentRefTree,
    getCurrentRefTreeStatus,
    getCurrentUser,
    getCurrentUserIsAdmin,
    getFlattenedRefTree,
    getHeadings,
    getHeadingsFetched,
    getHeadingsStatus,
    getInterviewsStatus,
    getLanguages,
    getLanguagesStatus,
    getMarkTextStatus,
    getMediaStreamsForCurrentProject,
    getPeopleStatus,
    getPermissions,
    getPermissionsStatus,
    getProjectLocales,
    getProjectsStatus,
    getRandomFeaturedInterviews,
    getRefTreeStatus,
    getRegistryEntries,
    getRegistryEntriesStatus,
    getRegistryNameTypesForCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
    getSegments,
    getSegmentsStatus,
    getSpeakerDesignationsStatus,
    getStatuses,
    getTasks,
    getTasksStatus,
    getTaskTypesForCurrentProject,
    getTaskTypesStatus,
    getTranscriptFetched,
    getUsers,
    getUsersStatus,
} from './dataSelectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
    },
    data: {
        users: {
            current: {
                id: 45,
                admin: true,
            },
        },
        statuses: {
            users: {
                current: 'fetched',
                resultPagesCount: 1,
            },
            collections: {
                for_projects_1: 'fetched',
            },
            contributions: {
                14: 'fetched-Mon',
            },
            headings: {
                for_interviews_cd003: 'fetched-Mon',
            },
            interviews: {
                za283: 'fetched',
            },
            languages: {
                all: 'fetched',
            },
            mark_text: {
                for_interviews_za003: 'fetched-Mon',
            },
            people: {
                12: 'fetched',
                contributors_for_interview_22: 'fetched',
                for_projects_1: 'fetched',
            },
            permissions: {
                page_1: 'fetched-Mon',
            },
            projects: {
                all: 'fetched',
            },
            random_featured_interviews: {
                all: 'fetched-Thu Dec 17 2020 18:20:22 GMT+0100 (Central European Standard Time)',
            },
            ref_tree: {
                for_interviews_cd003: 'fetched-Mon',
            },
            registry_entries: {
                1: 'fetched-Thu Jan 07 2021 21:17:39 GMT+0100 (Central European Standard Time)',
            },
            roles: {
                page_1: 'fetched-Mon',
            },
            segments: {
                for_interviews_za003: 'fetched-Mon',
                for_interviews_cd003: 'fetched-Tue',
            },
            speaker_designations: {
                for_interviews_za003: 'first_step_explanation',
            },
            tasks: {
                35: 'processed',
            },
            task_types: {
                for_projects_1: 'fetched',
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
                available_locales: ['de', 'en', 'ru'],
                has_map: true,
                root_registry_entry_id: 1,
                collections: {
                    1: {
                        id: 1,
                        type: 'Collection',
                    },
                },
                people: {
                    4: {
                        id: 4,
                        type: 'Person',
                    },
                },
                registry_name_types: {
                    2: {
                        id: 2,
                        type: 'RegistryNameType',
                        code: 'first_name',
                        name: 'Vorname',
                    },
                },
                roles: {
                    1: {
                        id: 1,
                        type: 'Role',
                    },
                },
                task_types: {
                    3: {
                        id: 3,
                        type: 'TaskType',
                        key: 'protocol',
                        abbreviation: 'Pro',
                    },
                },
                contribution_types: {
                    1: {
                        id: 1,
                        type: 'ContributionType',
                        code: 'interviewee',
                        project_id: 1,
                        label: {
                            de: 'Interviewte*r',
                            en: 'Interviewee',
                        },
                    },
                },
                media_streams: {
                    1: {
                        id: 1,
                        type: 'MediaStream',
                        project_id: 1,
                        path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/#{archive_id}/#{archive_id}_#{tape_count}_0#{tape_number}_sd480p.mp4',
                        media_type: 'video',
                        resolution: '480p',
                    },
                },
            },
        },
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                lang: 'ru',
                languages: ['ru', 'de'],
                contributions: {
                    1345: {
                        id: 1345,
                        type: 'Contribution',
                        contribution_type: 'interviewee',
                        person_id: 4,
                        interview_id: 22,
                    },
                },
                first_segments_ids: {
                    1: 199498,
                },
                ref_tree: {
                    id: 1,
                    type: 'node',
                    children: [
                        {
                            id: 11786,
                            type: 'node',
                            children: [
                                {
                                    type: 'leafe',
                                    time: 25.2,
                                    tape_nbr: 1,
                                },
                                {
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
                            ],
                        },
                    ],
                },
                segments: {
                    1: {
                        199498: {
                            id: 199498,
                            type: 'Segment',
                            text: {
                                de: 'dummy',
                                'de-public': 'dummy',
                                ru: 'dummy',
                                'ru-public': 'dummy',
                            },
                        },
                    },
                },
                headings: {
                    0: {
                        id: 19499,
                        type: 'Segment',
                    },
                },
            },
        },
        languages: {
            2: {
                id: 2,
                type: 'Language',
            },
        },
        registry_entries: {
            1: {
                id: 1,
            },
            23: {
                id: 23,
                type: 'RegistryEntry',
                name: {
                    de: 'Russland',
                    en: 'Russia',
                },
                children_count: 77,
            },
        },
        permissions: {
            92: {
                id: 92,
                type: 'Permission',
            },
        },
        segments: {
            99015: {
                type: 'Segment',
            },
        },
        tasks: {
            35: {
                id: 35,
                type: 'Task',
            },
        },
        random_featured_interviews: {
            cd009: {
                id: 23,
                type: 'Interview',
            },
        },
    },
};

test('getLanguages gets languages object', () => {
    expect(getLanguages(state)).toEqual(state.data.languages);
});

test('getCollectionsForCurrentProject gets collections object', () => {
    expect(getCollectionsForCurrentProject(state)).toEqual(
        state.data.projects[1].collections
    );
});

test('getTaskTypesForCurrentProject gets task_types object', () => {
    expect(getTaskTypesForCurrentProject(state)).toEqual(
        state.data.projects[1].task_types
    );
});

test('getRolesForCurrentProject gets roles object', () => {
    expect(getRolesForCurrentProject(state)).toEqual(
        state.data.projects[1].roles
    );
});

test('getStatuses gets statuses object', () => {
    expect(getStatuses(state)).toEqual(state.data.statuses);
});

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

test('getHeadings gets headings object of current interview', () => {
    expect(getHeadings(state)).toEqual(state.data.interviews.cd003.headings);
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

test('getRegistryEntriesStatus gets registry entries status object', () => {
    expect(getRegistryEntriesStatus(state)).toEqual(
        state.data.statuses.registry_entries
    );
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

test('getUsersStatus gets user registrations status object', () => {
    expect(getUsersStatus(state)).toEqual(state.data.statuses.users);
});

test('getUsers gets users object', () => {
    expect(getUsers(state)).toEqual(state.data.users);
});

test('getCurrentUser gets user object of current user', () => {
    expect(getCurrentUser(state)).toEqual(state.data.users.current);
});

test('getPermissions gets permissions object', () => {
    expect(getPermissions(state)).toEqual(state.data.permissions);
});

test('getRegistryEntries gets registry entries object', () => {
    expect(getRegistryEntries(state)).toEqual(state.data.registry_entries);
});

test('getRegistryNameTypesForCurrentProject gets registry name types object', () => {
    expect(getRegistryNameTypesForCurrentProject(state)).toEqual(
        state.data.registry_name_types
    );
});

test('getSegments gets segments object', () => {
    expect(getSegments(state)).toEqual(state.data.segments);
});

test('getTasks gets tasks object', () => {
    expect(getTasks(state)).toEqual(state.data.tasks);
});

test('getTaskTypesForCurrentProject gets task types object', () => {
    expect(getTaskTypesForCurrentProject(state)).toEqual(
        state.data.projects[1].task_types
    );
});

test('getUsers gets user registrations object', () => {
    expect(getUsers(state)).toEqual(state.data.users);
});

test('getRandomFeaturedInterviews gets featured interviews object', () => {
    expect(getRandomFeaturedInterviews(state)).toEqual(
        state.data.random_featured_interviews
    );
});

test('getCurrentUserIsAdmin gets admin status of current user', () => {
    expect(getCurrentUserIsAdmin(state)).toEqual(
        state.data.users.current.admin
    );
});

describe('getProjectLocales', () => {
    test('gets project locales', () => {
        expect(getProjectLocales(state)).toEqual(
            state.data.projects[1].available_locales
        );
    });

    test('gets default locales if no project is selected', () => {
        const _state = dotProp.set(state, 'archive.projectId', null);
        expect(getProjectLocales(_state)).toEqual(DEFAULT_LOCALES);
    });
});

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(getCurrentInterviewFetched(state)).toBe(true);
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

test('getMediaStreamsForCurrentProject retrieves media streams', () => {
    expect(getMediaStreamsForCurrentProject(state)).toEqual(
        state.data.mediaStreams
    );
});
