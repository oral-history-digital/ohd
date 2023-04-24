import { NAME  } from './constants';
import * as selectors from './selectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
        locale: 'de',
    },
    data: {
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                observations: {
                    de: 'Berlin Berlin Berlin',
                },
            },
        },
    },
    [NAME]: {
        registryEntries: {
            cdoh: {
                showRegistryEntriesTree: true,
                results: [],
            }
        },
        users: {
            query: {
                'user_projects.workflow_state': 'project_access_requested',
                page: 1,
            },
        },
        permissions: {
            query: {
                name: 'user',
                page: 2,
            },
        },
        projects: {
            1: {
                name: 'cdoh',
                roles: {
                    query: {
                        desc: 'interview',
                        page: 1,
                    },
                },
                task_types: {
                    query: {
                        label: 'protocol',
                        page: 1,
                    },
                },
                people: {
                    query: {
                        first_name: 'marina',
                        page: 2,
                    },
                },
                registry_reference_types: {
                    query: {
                        name: 'acquaintance',
                        page: 1,
                    },
                },
                registry_name_types: {

                },
                collections: {
                    query: {
                        name: 'israel',
                        page: 1,
                    },
                },
            },
        },
        languages: {
            query: {
                name: 'italian',
                page: 2,
            },
        },
        isRegistryEntrySearching: true,
    },
};

test('getRegistryEntriesSearch retrieves registry entries part of search state', () => {
    expect(selectors.getRegistryEntriesSearch(state)).toEqual(state[NAME].registryEntries.cdoh);
});

test('getShowRegistryEntriesSearchResults get wether to show search results', () => {
    expect(selectors.getShowRegistryEntriesSearchResults(state)).toEqual(!!state[NAME].registryEntries.cdoh.showRegistryEntriesSearchResults);
});

test('getIsRegistryEntrySearching retrieves registry entry search state', () => {
    expect(selectors.getIsRegistryEntrySearching(state)).toEqual(state[NAME].isRegistryEntrySearching);
});

test('getPeopleQuery retrieves people query params', () => {
    expect(selectors.getPeopleQuery(state)).toEqual(state[NAME].people.query);
});

test('getRegistryReferenceTypesQuery retrieves registry reference types query params', () => {
    expect(selectors.getRegistryReferenceTypesQuery(state)).toEqual(state[NAME].registry_reference_types.query);
});

test('getCollectionsQuery retrieves collections query params', () => {
    expect(selectors.getCollectionsQuery(state)).toEqual(state[NAME].collections.query);
});

test('getLanguagesQuery retrieves languages query params', () => {
    expect(selectors.getLanguagesQuery(state)).toEqual(state[NAME].languages.query);
});

test('getRolesQuery retrieves roles query params', () => {
    expect(selectors.getRolesQuery(state)).toEqual(state[NAME].roles.query);
});

test('getPermissionsQuery retrieves permissions query params', () => {
    expect(selectors.getPermissionsQuery(state)).toEqual(state[NAME].permissions.query);
});

test('getTaskTypesQuery retrieves task types query params', () => {
    expect(selectors.getTaskTypesQuery(state)).toEqual(state[NAME].task_types.query);
});

test('getUsersQuery retrieves user registrations query params', () => {
    expect(selectors.getUsersQuery(state)).toEqual(state[NAME].users.query);
});
