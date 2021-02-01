import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        archive: {
            facets: {
                gender: {},
            },
            query: {
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
            query: {
                page: 1,
            },
            foundMarkers: {},
        },
        interviews: {

        },
        registryEntries: {
            showRegistryEntriesTree: true,
            results: [],
        },
        user_registrations: {

        },
        roles: {

        },
        task_types: {

        },
        permissions: {

        },
        people: {

        },
        registry_reference_types: {

        },
        registry_name_types: {

        },
        projects: {

        },
        collections: {

        },
        languages: {

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

test('getMarkersFetched retrieves if markers have been loaded', () => {
    expect(selectors.getMarkersFetched(state)).toEqual(false);
});

test('getMapQuery retrieves map query object', () => {
    expect(selectors.getMapQuery(state)).toEqual(state[NAME].map.query);
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
