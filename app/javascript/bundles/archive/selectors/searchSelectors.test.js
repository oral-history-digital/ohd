import * as selectors from './searchSelectors';

const state = {
    search: {
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
    expect(selectors.getArchiveFacets(state)).toEqual(state.search.archive.facets);
});

test('getArchiveQuery retrieves archive query object', () => {
    expect(selectors.getArchiveQuery(state)).toEqual(state.search.archive.query);
});

test('getArchiveFoundInterviews retrieves archive found interviews array', () => {
    expect(selectors.getArchiveFoundInterviews(state)).toEqual(state.search.archive.foundInterviews);
});

test('getArchiveResultPagesCount retrieves number of archive result pages', () => {
    expect(selectors.getArchiveResultPagesCount(state)).toEqual(state.search.archive.resultPagesCount);
});

test('getArchiveResultsCount retrieves number of archive results', () => {
    expect(selectors.getArchiveResultsCount(state)).toEqual(state.search.archive.resultsCount);
});

test('getMapSearch retrieves map part of search state', () => {
    expect(selectors.getMapSearch(state)).toEqual(state.search.map);
});

test('getFoundMarkers retrieves found map markers', () => {
    expect(selectors.getFoundMarkers(state)).toEqual(state.search.map.foundMarkers);
});

test('getMarkersFetched retrieves if markers have been loaded', () => {
    expect(selectors.getMarkersFetched(state)).toEqual(false);
});

test('getMapQuery retrieves map query object', () => {
    expect(selectors.getMapQuery(state)).toEqual(state.search.map.query);
});

test('getRegistryEntriesSearch retrieves registry entries part of search state', () => {
    expect(selectors.getRegistryEntriesSearch(state)).toEqual(state.search.registryEntries);
});

test('getShowRegistryEntriesTree get wether to show search results', () => {
    expect(selectors.getShowRegistryEntriesTree(state)).toEqual(state.search.registryEntries.showRegistryEntriesTree);
});

test('getIsMapSearching retrieves map search state', () => {
    expect(selectors.getIsMapSearching(state)).toEqual(state.search.isMapSearching);
});

test('getIsRegistryEntrySearching retrieves registry entry search state', () => {
    expect(selectors.getIsRegistryEntrySearching(state)).toEqual(state.search.isRegistryEntrySearching);
});
