import { createSelector } from 'reselect';

import { getArchiveId } from 'modules/archive';
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

export const getMapFilter = state => getMapSearch(state).filter;

function markerRadius(numReferences) {
    return Math.cbrt(numReferences + 3) * 4;
}

export const getMapMarkers = createSelector(
    [getFoundMarkers, getMapFilter],
    (markers, filter) => {
        if (!markers || !filter) {
            return null;
        }

        const convertedMarkers = markers
            .map(marker => {
                const types = marker.ref_types
                    .split(',')
                    .map(type => Number.parseInt(type))
                    .filter(type => filter.includes(type));
                const numReferences = types.length;
                const uniqueTypes = [...new Set(types)];

                return {
                    id: marker.id,
                    name: marker.name,
                    lat: Number.parseFloat(marker.lat),
                    long: Number.parseFloat(marker.lon),
                    numReferences,
                    referenceTypes: uniqueTypes,
                    color: 'red',
                    radius: markerRadius(numReferences),
                };
            })
            .filter(marker => marker.numReferences > 0)
            // Markers with more references should be first so that
            // they don't mask smaller markers on the Leaflet marker pane.
            .sort((markerA, markerB) => markerB.numReferences - markerA.numReferences);

        return convertedMarkers;
    }
);

export const getMarkersFetched = state => getFoundMarkers(state) !== null;

export const getMapReferenceTypes = state => getMapSearch(state).referenceTypes;

export const getMapQuery = state => getMapSearch(state).query;

export const getMapFacets = state => getMapSearch(state).facets;

export const getRegistryEntriesSearch = state => getState(state).registryEntries;

export const getShowRegistryEntriesTree = createSelector(
    getRegistryEntriesSearch,
    registryEntriesSearch => registryEntriesSearch.showRegistryEntriesTree
);

export const getIsRegistryEntrySearching = state => getState(state).isRegistryEntrySearching;

export const getPeopleQuery = state => getState(state).people.query;

export const getRegistryReferenceTypesQuery = state => getState(state).registry_reference_types.query;

export const getRegistryNameTypesQuery = state => getState(state).registry_name_types.query;

export const getContributionTypesQuery = state => getState(state).contribution_types.query;

export const getCollectionsQuery = state => getState(state).collections.query;

export const getLanguagesQuery = state => getState(state).languages.query;

export const getRolesQuery = state => getState(state).roles.query;

export const getPermissionsQuery = state => getState(state).permissions.query;

export const getTaskTypesQuery = state => getState(state).task_types.query;

export const getUserRegistrationsQuery = state => getState(state).user_registrations.query;

export const getInterviewSearchResults = state => getState(state).interviews;

export const getCurrentInterviewSearchResults = createSelector(
    [getInterviewSearchResults, getArchiveId],
    (searchResults, archiveId) => {
        return searchResults?.[archiveId];
    }
);

export const getSegmentResults = state => getCurrentInterviewSearchResults(state)?.foundSegments;

export const getHeadingResults = state => getCurrentInterviewSearchResults(state)?.foundHeadings;

export const getRegistryEntryResults = state => getCurrentInterviewSearchResults(state)?.foundRegistryEntries;

export const getPhotoResults = state => getCurrentInterviewSearchResults(state)?.foundPhotos;

export const getBiographyResults = state => getCurrentInterviewSearchResults(state)?.foundBiographicalEntries;

export const getAnnotationResults = state => getCurrentInterviewSearchResults(state)?.foundAnnotations;

export const getObservationsResults = state => getCurrentInterviewSearchResults(state)?.foundObservations;
