import { createSelector } from 'reselect';

const getSearch = state => state.search;

const getArchiveSearch = state => getSearch(state).archive;

export const getArchiveFacets = state => getArchiveSearch(state).facets;

export const getArchiveQuery = state => getArchiveSearch(state).query;

export const getArchiveFoundInterviews = state => getArchiveSearch(state).foundInterviews;

export const getArchiveResultPagesCount = state => getArchiveSearch(state).resultPagesCount;

export const getArchiveResultsCount = state => getArchiveSearch(state).resultsCount;

export const getMapSearch = state => getSearch(state).map;

export const getFoundMarkers = state => getMapSearch(state).foundMarkers;

export const getMarkersFetched = state => Object.keys(getFoundMarkers(state)).length > 0;

export const getMapQuery = state => getMapSearch(state).query;

export const getRegistryEntriesSearch = state => getSearch(state).registryEntries;

export const getShowRegistryEntriesTree = createSelector(
    getRegistryEntriesSearch,
    registryEntriesSearch => registryEntriesSearch.showRegistryEntriesTree
);

export const getIsMapSearching = state => getSearch(state).isMapSearching;

export const getIsRegistryEntrySearching = state => getSearch(state).isRegistryEntrySearching;
