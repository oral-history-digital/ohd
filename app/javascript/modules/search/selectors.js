import { createSelector } from 'reselect';
import { NAME } from './constants';

const getState = state => state[NAME];

const getArchiveSearch = state => getState(state).archive;

export const getArchiveFacets = state => getArchiveSearch(state).facets;

export const getArchiveQuery = state => getArchiveSearch(state).query;

export const getArchiveQueryFulltext = state => getArchiveQuery(state).fulltext;

export const getArchiveFoundInterviews = state => getArchiveSearch(state).foundInterviews;

export const getArchiveResultPagesCount = state => getArchiveSearch(state).resultPagesCount;

export const getArchiveResultsCount = state => getArchiveSearch(state).resultsCount;

export const getMapSearch = state => getState(state).map;

export const getFoundMarkers = state => getMapSearch(state).foundMarkers;

export const getMarkersFetched = state => Object.keys(getFoundMarkers(state)).length > 0;

export const getMapQuery = state => getMapSearch(state).query;

export const getMapFacets = state => getMapSearch(state).facets;

export const getRegistryEntriesSearch = state => getState(state).registryEntries;

export const getShowRegistryEntriesTree = createSelector(
    getRegistryEntriesSearch,
    registryEntriesSearch => registryEntriesSearch.showRegistryEntriesTree
);

export const getIsMapSearching = state => getState(state).isMapSearching;

export const getIsRegistryEntrySearching = state => getState(state).isRegistryEntrySearching;

export const getPeopleQuery = state => getState(state).people.query;

export const getRegistryReferenceTypesQuery = state => getState(state).registry_reference_types.query;

export const getCollectionsQuery = state => getState(state).collections.query;

export const getLanguagesQuery = state => getState(state).languages.query;

export const getRolesQuery = state => getState(state).roles.query;

export const getPermissionsQuery = state => getState(state).permissions.query;

export const getTaskTypesQuery = state => getState(state).task_types.query;

export const getUserRegistrationsQuery = state => getState(state).user_registrations.query;

export const getInterviewSearch = state => getState(state).interviews;
