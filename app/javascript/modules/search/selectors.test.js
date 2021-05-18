import dotProp from 'dot-prop-immutable';

import { NAME, MAP_DEFAULT_BOUNDS } from './constants';
import * as selectors from './selectors';

const state = {
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
                    lat: '5.4',
                    lon: '23.3',
                    ref_types: '1,2,7,8,1',
                },
                {
                    id: 13,
                    name: 'Paris',
                    lat: '12.2',
                    lon: '30.1',
                    ref_types: '3',
                },
            ],
            referenceTypes: [{
                id: 1,
                name: 'Habitation',
            }],
            filter: [1, 2],
        },
        interviews: {
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
                workflow_state: 'account_confirmed',
                page: 1,
            },
        },
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
        permissions: {
            query: {
                name: 'account',
                page: 2,
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
        projects: {

        },
        collections: {
            query: {
                name: 'israel',
                page: 1,
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
            id: 12,
            name: 'London',
            lat: 5.4,
            lon: 23.3,
            numReferences: 3,
            referenceTypes: [1, 2],
        },
    ];
    expect(actual).toEqual(expected);
});

describe('getMapBounds', () => {
    test('retrieves an array of all lat long data for map library', () => {
        const actual = selectors.getMapBounds(state);
        const expected = [
            [5.4, 23.3],
            [12.2, 30.1],
        ];
        expect(actual).toEqual(expected);
    });

    test('retrieves default bounds if there is no data', () => {
        const _state = dotProp.set(state, `${NAME}.map.foundMarkers`, null);
        expect(selectors.getMapBounds(_state)).toEqual(MAP_DEFAULT_BOUNDS);
    });

    test('retrieves default bounds if markers are empty', () => {
        const _state = dotProp.set(state, `${NAME}.map.foundMarkers`, []);
        expect(selectors.getMapBounds(_state)).toEqual(MAP_DEFAULT_BOUNDS);
    });
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
