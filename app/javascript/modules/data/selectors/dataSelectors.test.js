import dotProp from 'dot-prop-immutable';
import * as selectors from './dataSelectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
    },
    data: {
        accounts: {
            current: {
                id: 45,
                admin: true,
            },
        },
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
        statuses: {
            interviews: {
                za283: 'fetched',
            },
            people: {
                12: 'fetched',
                contributors_for_interview_22: 'fetched',
            },
            random_featured_interviews: {
                all: 'fetched-Thu Dec 17 2020 18:20:22 GMT+0100 (Central European Standard Time)',
            },
            registry_entries: {
                1: 'fetched-Thu Jan 07 2021 21:17:39 GMT+0100 (Central European Standard Time)',
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
                root_registry_entry_id: 1,
            },
        },
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
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
        registry_name_types: {
            2: {
                id: 2,
                type: 'RegistryNameType',
                code: 'first_name',
                name: 'Vorname',
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
        user_contents: {
            3596: {
                id: 3596,
                type: 'InterviewReference',
                user_account_id: 45,
                media_id: 'za003',
            },
        },
        random_featured_interviews: {
            'cd009': {
                id: 23,
                type: 'Interview',
            },
        },
        contribution_types: {
            1: {
                id: 1,
                type: 'ContributionType',
                project_id: 1,
                label: {
                    de: 'Interviewte*r',
                    en: 'Interviewee',
                },
            },
        },
        MediaStream: {
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
};

test('getData gets data object', () => {
    expect(selectors.getData(state)).toEqual(state.data);
});

test('getLanguages gets languages object', () => {
    expect(selectors.getLanguages(state)).toEqual(state.data.languages);
});

test('getCollections gets collections object', () => {
    expect(selectors.getCollections(state)).toEqual(state.data.collections);
});

test('getPeople gets people object', () => {
    expect(selectors.getPeople(state)).toEqual(state.data.people);
});

test('getStatuses gets statuses object', () => {
    expect(selectors.getStatuses(state)).toEqual(state.data.statuses);
});

test('getPeopleStatus gets people status object', () => {
    expect(selectors.getPeopleStatus(state)).toEqual(state.data.statuses.people);
});

test('getInterviewsStatus gets interviews status object', () => {
    expect(selectors.getInterviewsStatus(state)).toEqual(state.data.statuses.interviews);
});

test('getRegistryEntriesStatus gets registry entries status object', () => {
    expect(selectors.getRegistryEntriesStatus(state)).toEqual(state.data.statuses.registry_entries);
});

test('getProjects gets projects object', () => {
    expect(selectors.getProjects(state)).toEqual(state.data.projects);
});

test('getAccounts gets accounts object', () => {
    expect(selectors.getAccounts(state)).toEqual(state.data.accounts);
});

test('getCurrentAccount gets account object of current user', () => {
    expect(selectors.getCurrentAccount(state)).toEqual(state.data.accounts.current);
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

test('getRegistryNameTypes gets registry name types object', () => {
    expect(selectors.getRegistryNameTypes(state)).toEqual(state.data.registry_name_types);
});

test('getTaskTypes gets task types object', () => {
    expect(selectors.getTaskTypes(state)).toEqual(state.data.task_types);
});

test('getUserContents gets user contents object', () => {
    expect(selectors.getUserContents(state)).toEqual(state.data.user_contents);
});

test('getRandomFeaturedInterviews gets featured interviews object', () => {
    expect(selectors.getRandomFeaturedInterviews(state)).toEqual(state.data.random_featured_interviews);
});

describe('getFeaturedInterviewsArray', () => {
    test('gets featured interviews array', () => {
        const actual = selectors.getFeaturedInterviewsArray(state);
        const expected = [{ id: 23, type: 'Interview' }];
        expect(actual).toEqual(expected);
    });

    test('gets empty array if interviews are not available', () => {
        const _state = dotProp.set(state, 'data.random_featured_interviews', undefined);
        const actual = selectors.getFeaturedInterviewsArray(_state);
        const expected = [];
        expect(actual).toEqual(expected);
    });
});

test('getCurrentUserIsAdmin gets admin status of current account', () => {
    expect(selectors.getCurrentUserIsAdmin(state)).toEqual(state.data.accounts.current.admin);
});

test('get gets data of a specific type', () => {
    expect(selectors.get(state, 'collections', 1)).toEqual(state.data.collections[1]);
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

test('getInterviews retrieves all interviews', () => {
    expect(selectors.getInterviews(state)).toEqual(state.data.interviews);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(selectors.getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(selectors.getCurrentInterviewFetched(state)).toBe(true);
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(selectors.getContributorsFetched(state)).toBe(true);
});

test('getFeaturedInterviewsFetched retrieves if featured interviews have been fetched', () => {
    expect(selectors.getFeaturedInterviewsFetched(state)).toBe(true);
});

test('getContributionTypes retrieves contributionTypes object', () => {
    expect(selectors.getContributionTypes(state)).toEqual(state.data.contribution_types);
});

test('getMediaStreams retrieves media streams', () => {
    expect(selectors.getMediaStreams(state)).toEqual(state.data.mediaStreams);
});
