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
            people: {
                12: 'fetched',
                contributors_for_interview_22: 'fetched',
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
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

test('getPeopleStatuses gets people statuses object', () => {
    expect(selectors.getPeopleStatus(state)).toEqual(state.data.statuses.people);
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

test('getRegistryNameTypes gets registry name types object', () => {
    expect(selectors.getRegistryNameTypes(state)).toEqual(state.data.registry_name_types);
});

test('getTaskTypes gets task types object', () => {
    expect(selectors.getTaskTypes(state)).toEqual(state.data.task_types);
});

test('getUserContents gets user contents object', () => {
    expect(selectors.getUserContents(state)).toEqual(state.data.user_contents);
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
