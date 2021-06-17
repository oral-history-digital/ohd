import dotProp from 'dot-prop-immutable';

import { NAME  } from './constants';
import * as selectors from './selectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
    },
    [NAME]: {
        archive: {
            facets: {
                gender: {
                    name: {
                        en: 'Gender',
                    },
                },
            },
            query: {
                fulltext: 'alice',
                page: 1,
            },
            foundInterviews: [
                {
                    id: 254,
                    type: 'Interview',
                },
            ],
            resultPagesCount: 50,
            resultsCount: 590,
        },
        map: {
            facets: {
                language_id: {
                    name: {
                        en: 'Language',
                    },
                },
            },
            query: {
                page: 1,
            },
            foundMarkers: [
                {
                    id: 12,
                    name: 'London',
                    lat: '51.51',
                    lon: '-0.11',
                    ref_types: '1,2,7,8,1',
                },
                {
                    id: 13,
                    name: 'Paris',
                    lat: '48.85',
                    lon: '2.35',
                    ref_types: '3',
                },
                {
                    id: 14,
                    name: 'New York City',
                    lat: '40.71',
                    lon: '-74.00',
                    ref_types: '7,8,1,1,1,1,1,1,1',
                },
            ],
            referenceTypes: [
                {
                    id: 1,
                    name: 'Habitation',
                    color: '#1c2d8f',
                },
                {
                    id: 2,
                    name: 'Birthplace',
                    color: '#1c2d8f',
                }],
            filter: [1, 2],
        },
        interviews: {
            cd003: {
                fulltext: 'berlin',
            },
            za003: {
                fulltext: 'poland',
            },
        },
        registryEntries: {
            showRegistryEntriesTree: true,
            results: [],
        },
        user_registrations: {
            query: {
                'user_registration_projects.workflow_state': 'account_confirmed',
                page: 1,
            },
        },
        permissions: {
            query: {
                name: 'account',
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
        isMapSearching: true,
        isRegistryEntrySearching: true,
    },
};

test('getArchiveFacets retrieves archive facets object', () => {
    expect(selectors.getArchiveFacets(state)).toEqual(state[NAME].archive.facets);
});

test('getArchiveQuery retrieves archive query object', () => {
    expect(selectors.getArchiveQuery(state)).toEqual(state[NAME].archive.query);
});

test('getArchiveQueryFulltext retrieves archive query object fulltext part', () => {
    expect(selectors.getArchiveQueryFulltext(state)).toEqual(state[NAME].archive.query.fulltext);
});

test('getArchiveFoundInterviews retrieves archive found interviews array', () => {
    expect(selectors.getArchiveFoundInterviews(state)).toEqual(state[NAME].archive.foundInterviews);
});

test('getArchiveResultPagesCount retrieves number of archive result pages', () => {
    expect(selectors.getArchiveResultPagesCount(state)).toEqual(state[NAME].archive.resultPagesCount);
});

test('getArchiveResultsCount retrieves number of archive results', () => {
    expect(selectors.getArchiveResultsCount(state)).toEqual(state[NAME].archive.resultsCount);
});

test('getMapSearch retrieves map part of search state', () => {
    expect(selectors.getMapSearch(state)).toEqual(state[NAME].map);
});

test('getFoundMarkers retrieves found map markers', () => {
    expect(selectors.getFoundMarkers(state)).toEqual(state[NAME].map.foundMarkers);
});

test('getMapMarkers retrieves filtered and converted map markers', () => {
    const actual = selectors.getMapMarkers(state);
    const expected = [
        {
            id: 14,
            name: 'New York City',
            lat: 40.71,
            lon: -74,
            numReferences: 7,
            referenceTypes: [1],
        },
        {
            id: 12,
            name: 'London',
            lat: 51.51,
            lon: -0.11,
            numReferences: 3,
            referenceTypes: [1, 2],
        },
    ];
    expect(actual).toEqual(expected);
});

describe('getMarkersFetched', () => {
    test('is true if markers have been loaded', () => {
        expect(selectors.getMarkersFetched(state)).toBeTruthy();
    });

    test('is false if markers have not been loaded', () => {
        const _state = dotProp.set(state, `${NAME}.map.foundMarkers`, null);
        expect(selectors.getMarkersFetched(_state)).toBeFalsy();
    });
});

test('getMapReferenceTypes retrieves map reference types array', () => {
    expect(selectors.getMapReferenceTypes(state)).toEqual(state[NAME].map.referenceTypes);
});

test('getLocationCountByReferenceType retrieves location number for each type', () => {
    const actual = selectors.getLocationCountByReferenceType(state);
    const expected = {
        '1': 2,
        '2': 1,
    };
    expect(actual).toEqual(expected);
});

test('getMapFilter retrieves map filter array', () => {
    expect(selectors.getMapFilter(state)).toEqual(state[NAME].map.filter);
});

test('getMapQuery retrieves map query object', () => {
    expect(selectors.getMapQuery(state)).toEqual(state[NAME].map.query);
});

test('getMapFacets retrieves map facets object', () => {
    expect(selectors.getMapFacets(state)).toEqual(state[NAME].map.facets);
});

test('getRegistryEntriesSearch retrieves registry entries part of search state', () => {
    expect(selectors.getRegistryEntriesSearch(state)).toEqual(state[NAME].registryEntries);
});

test('getShowRegistryEntriesTree get wether to show search results', () => {
    expect(selectors.getShowRegistryEntriesTree(state)).toEqual(state[NAME].registryEntries.showRegistryEntriesTree);
});

test('getIsMapSearching retrieves map search state', () => {
    expect(selectors.getIsMapSearching(state)).toEqual(state[NAME].isMapSearching);
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

test('getUserRegistrationsQuery retrieves user registrations query params', () => {
    expect(selectors.getUserRegistrationsQuery(state)).toEqual(state[NAME].user_registrations.query);
});

test('getInterviewSearch retrieves interview search results', () => {
    expect(selectors.getInterviewSearch(state)).toEqual(state[NAME].interviews);
});

test('getCurrentInterviewSearch retrieves current interview search results', () => {
    expect(selectors.getCurrentInterviewSearch(state)).toEqual(state[NAME].interviews.cd003);
});
