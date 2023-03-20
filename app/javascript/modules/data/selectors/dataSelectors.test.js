import dotProp from 'dot-prop-immutable';
import * as selectors from './dataSelectors';

import { DEFAULT_LOCALES } from 'modules/constants';

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
                'for_projects_1': 'fetched',
            },
            users: {
                resultPagesCount: 1,
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
                                }
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
                                'de': 'dummy',
                                'de-public': 'dummy',
                                'ru': 'dummy',
                                'ru-public': 'dummy',
                            },
                        },
                    }
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
        users: {},
        random_featured_interviews: {
            'cd009': {
                id: 23,
                type: 'Interview',
            },
        },
    },
};

test('getData gets data object', () => {
    expect(selectors.getData(state)).toEqual(state.data);
});

test('getLanguages gets languages object', () => {
    expect(selectors.getLanguages(state)).toEqual(state.data.languages);
});

test('getCollectionsForCurrentProject gets collections object', () => {
    expect(selectors.getCollectionsForCurrentProject(state)).toEqual(state.data.projects[1].collections);
});

test('getTaskTypesForCurrentProject gets task_types object', () => {
    expect(selectors.getTaskTypesForCurrentProject(state)).toEqual(state.data.projects[1].task_types);
});

test('getRolesForCurrentProject gets roles object', () => {
    expect(selectors.getRolesForCurrentProject(state)).toEqual(state.data.projects[1].roles);
});

test('getStatuses gets statuses object', () => {
    expect(selectors.getStatuses(state)).toEqual(state.data.statuses);
});

test('getAccountsStatus gets users status object', () => {
    expect(selectors.getAccountsStatus(state)).toEqual(state.data.statuses.users);
});

test('getCollectionsStatus gets collections status object', () => {
    expect(selectors.getCollectionsStatus(state)).toEqual(state.data.statuses.collections);
});

test('getContributionsStatus gets contributions status object', () => {
    expect(selectors.getContributionsStatus(state)).toEqual(state.data.statuses.contributions);
});

test('getHeadingsStatus gets headings status object', () => {
    expect(selectors.getHeadingsStatus(state)).toEqual(state.data.statuses.headings);
});

test('getHeadingsFetched gets if headings of current interview are fetched', () => {
    expect(selectors.getHeadingsFetched(state)).toBeTruthy();
});

test('getHeadings gets headings object of current interview', () => {
    expect(selectors.getHeadings(state)).toEqual(state.data.interviews.cd003.headings);
})

test('getLanguagesStatus gets languages status object', () => {
    expect(selectors.getLanguagesStatus(state)).toEqual(state.data.statuses.languages);
});

test('getMarkTextStatus gets mark text status object', () => {
    expect(selectors.getMarkTextStatus(state)).toEqual(state.data.statuses.mark_text);
});

test('getPeopleStatus gets people status object', () => {
    expect(selectors.getPeopleStatus(state)).toEqual(state.data.statuses.people);
});

test('getPermissionsStatus gets permissions status object', () => {
    expect(selectors.getPermissionsStatus(state)).toEqual(state.data.statuses.permissions);
});

test('getProjectsStatus gets projects status object', () => {
    expect(selectors.getProjectsStatus(state)).toEqual(state.data.statuses.projects);
});

test('getInterviewsStatus gets interviews status object', () => {
    expect(selectors.getInterviewsStatus(state)).toEqual(state.data.statuses.interviews);
});

test('getRefTreeStatus gets ref tree status object', () => {
    expect(selectors.getRefTreeStatus(state)).toEqual(state.data.statuses.ref_tree);
});

describe('getCurrentRefTreeStatus', () => {
    it("is 'fetched' if ref tree has been loaded", () => {
        expect(selectors.getCurrentRefTreeStatus(state)).toBe('fetched');
    });

    it("is 'fetching' if ref tree is loading", () => {
        const _state = dotProp.set(state, 'data.statuses.ref_tree.for_interviews_cd003', 'fetching');
        expect(selectors.getCurrentRefTreeStatus(_state)).toBe('fetching');
    });

    it("is 'n/a' otherwise", () => {
        const _state = dotProp.set(state, 'archive.archiveId', 'za053');
        expect(selectors.getCurrentRefTreeStatus(_state)).toBe('n/a');
    });
});

test('getRegistryEntriesStatus gets registry entries status object', () => {
    expect(selectors.getRegistryEntriesStatus(state)).toEqual(state.data.statuses.registry_entries);
});

test('getRolesStatus gets roles status object', () => {
    expect(selectors.getRolesStatus(state)).toEqual(state.data.statuses.roles);
});

test('getSegmentsStatus gets segments status object', () => {
    expect(selectors.getSegmentsStatus(state)).toEqual(state.data.statuses.segments);
});

test('getSpeakerDesignationsStatus gets speaker designations status object', () => {
    expect(selectors.getSpeakerDesignationsStatus(state)).toEqual(state.data.statuses.speaker_designations);
});

test('getTasksStatus gets tasks status object', () => {
    expect(selectors.getTasksStatus(state)).toEqual(state.data.statuses.tasks);
});

test('getTaskTypesStatus gets task types status object', () => {
    expect(selectors.getTaskTypesStatus(state)).toEqual(state.data.statuses.task_types);
});

test('getUsersStatus gets user registrations status object', () => {
    expect(selectors.getUsersStatus(state)).toEqual(state.data.statuses.users);
});

test('getProjects gets projects object', () => {
    expect(selectors.getProjects(state)).toEqual(state.data.projects);
});

test('getAccounts gets users object', () => {
    expect(selectors.getAccounts(state)).toEqual(state.data.users);
});

test('getCurrentUser gets user object of current user', () => {
    expect(selectors.getCurrentUser(state)).toEqual(state.data.users.current);
});

test('getPermissions gets permissions object', () => {
    expect(selectors.getPermissions(state)).toEqual(state.data.permissions);
});

test('getRegistryEntries gets registry entries object', () => {
    expect(selectors.getRegistryEntries(state)).toEqual(state.data.registry_entries);
});

test('getRootRegistryEntry gets root registry entry', () => {
    expect(selectors.getRootRegistryEntry(state)).toEqual(state.data.registry_entries[1]);
});

test('getRootRegistryEntryFetched is true if entry is fetched', () => {
    expect(selectors.getRootRegistryEntryFetched(state)).toBeTruthy();
});

test('getRegistryNameTypesForCurrentProject gets registry name types object', () => {
    expect(selectors.getRegistryNameTypesForCurrentProject(state)).toEqual(state.data.registry_name_types);
});

test('getSegments gets segments object', () => {
    expect(selectors.getSegments(state)).toEqual(state.data.segments);
});

test('getTasks gets tasks object', () => {
    expect(selectors.getTasks(state)).toEqual(state.data.tasks);
});

test('getTaskTypesForCurrentProject gets task types object', () => {
    expect(selectors.getTaskTypesForCurrentProject(state)).toEqual(state.data.task_types);
});

test('getUsers gets user registrations object', () => {
    expect(selectors.getUsers(state)).toEqual(state.data.users);
});

test('getRandomFeaturedInterviews gets featured interviews object', () => {
    expect(selectors.getRandomFeaturedInterviews(state)).toEqual(state.data.random_featured_interviews);
});

test('getCurrentUserIsAdmin gets admin status of current user', () => {
    expect(selectors.getCurrentUserIsAdmin(state)).toEqual(state.data.users.current.admin);
});

describe('getCurrentProject', () => {
    test('gets currently selected project\'s object', () => {
        expect(selectors.getCurrentProject(state)).toEqual(state.data.projects[1]);
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

        expect(selectors.getCurrentProject(state)).toBeNull();
    });
});

describe('getProjectLocales', () => {
    test('gets project locales', () => {
        expect(selectors.getProjectLocales(state)).toEqual(state.data.projects[1].available_locales);
    });

    test('gets default locales if no project is selected', () => {
        const _state = dotProp.set(state, 'archive.projectId', null);
        expect(selectors.getProjectLocales(_state)).toEqual(DEFAULT_LOCALES);
    });
});

test('getProjectHasMap gets if project has a mpa', () => {
    expect(selectors.getProjectHasMap(state)).toEqual(state.data.projects[1].has_map);
});

test('getInterviews retrieves all interviews', () => {
    expect(selectors.getInterviews(state)).toEqual(state.data.interviews);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(selectors.getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(selectors.getCurrentInterviewFetched(state)).toBe(true);
});

test('getCurrentRefTree retrieves ref tree of current interview', () => {
    expect(selectors.getCurrentRefTree(state)).toEqual(state.data.interviews.cd003.ref_tree);
});

test('getFlattenedRefTree retrieves flattened version of ref tree', () => {
    const actual = selectors.getFlattenedRefTree(state);
    const expected = {
        '11310': {
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
        '11786': {
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
        expect(selectors.getTranscriptFetched(state)).toBeTruthy();
    });

    test('returns false if transcript has not been fetched', () => {
        const _state = dotProp.set(state, 'archive.archiveId', 'za085');
        expect(selectors.getTranscriptFetched(_state)).toBeFalsy();
    });
});

describe('getTranscriptLocale', () => {
    test('returns original locale if prop is set', () => {
        const props = { originalLocale: true };
        expect(selectors.getTranscriptLocale(state, props)).toBe('ru');
    });

    test('returns first translated locale if prop is set', () => {
        const props = { originalLocale: false };
        expect(selectors.getTranscriptLocale(state, props)).toBe('de');
    });
});

describe('getHasTranscript', () => {
    test('returns true if there is at least one segment with text in original locale', () => {
        const props = { originalLocale: true };
        expect(selectors.getHasTranscript(state, props)).toBeTruthy();
    });

    test('returns true if there is at least one segment with text in translation', () => {
        const props = { originalLocale: false };
        expect(selectors.getHasTranscript(state, props)).toBeTruthy();
    });

    test('returns false if text of the segment is null', () => {
        const _state = dotProp.set(state, 'data.interviews.cd003.segments.1.199498.text.de', null);
        const _state2 = dotProp.set(_state, 'data.interviews.cd003.segments.1.199498.text.de-public', null);
        const props = { originalLocale: false };
        expect(selectors.getHasTranscript(_state2, props)).toBeFalsy();
    });
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(selectors.getContributorsFetched(state)).toBe(true);
});

test('getContributionTypesForCurrentProject retrieves contributionTypes object', () => {
    expect(selectors.getContributionTypesForCurrentProject(state)).toEqual(state.data.contribution_types);
});

test('getMediaStreamsForCurrentProject retrieves media streams', () => {
    expect(selectors.getMediaStreamsForCurrentProject(state)).toEqual(state.data.mediaStreams);
});
