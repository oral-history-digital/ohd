import { getData, getLanguages, getPeople, getStatuses, getPeopleStatus, getCollections,
    getProjects, getCurrentProject, getCurrentAccount, get } from './dataSelectors';

const state = {
    archive: {
        projectId: 'cdoh',
    },
    data: {
        accounts: {
            current: {
                id: 45,
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
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
            },
        },
        languages: {
            2: {
                id: 2,
                type: 'Language',
            },
        },
    },
};

test('getData gets data object', () => {
    expect(getData(state)).toEqual(state.data);
});

test('getLanguages gets languages object', () => {
    expect(getLanguages(state)).toEqual(state.data.languages);
});

test('getCollections gets collections object', () => {
    expect(getCollections(state)).toEqual(state.data.collections);
});

test('getPeople gets people object', () => {
    expect(getPeople(state)).toEqual(state.data.people);
});

test('getStatuses gets statuses object', () => {
    expect(getStatuses(state)).toEqual(state.data.statuses);
});

test('getPeopleStatuses gets people statuses object', () => {
    expect(getPeopleStatus(state)).toEqual(state.data.statuses.people);
});

test('getProjects gets projects object', () => {
    expect(getProjects(state)).toEqual(state.data.projects);
});

test('getCurrentAccount gets account object', () => {
    expect(getCurrentAccount(state)).toEqual(state.data.accounts.current);
});

test('get gets data of a specific type', () => {
    expect(get(state, 'collections', 1)).toEqual(state.data.collections[1]);
});

describe('getCurrentProject', () => {
    test('gets currently selected project\'s object', () => {
        expect(getCurrentProject(state)).toEqual(state.data.projects[1]);
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
