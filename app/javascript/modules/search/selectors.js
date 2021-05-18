import { createSelector } from 'reselect';
import { NAME, MAP_DEFAULT_BOUNDS } from './constants';

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
                    lon: Number.parseFloat(marker.lon),
                    numReferences,
                    referenceTypes: uniqueTypes,
                };
            })
            .filter(marker => marker.numReferences > 0);

        return convertedMarkers;
    }
);

export const getMapBounds = createSelector(
    getFoundMarkers,
    markers => {
        if (!markers || markers.length === 0) {
            return MAP_DEFAULT_BOUNDS;
        }

        const allLats = markers.map(marker => Number.parseFloat(marker.lat));
        const allLngs = markers.map(marker => Number.parseFloat(marker.lon));

        const minLat = Math.min.apply(null, allLats);
        const maxLat = Math.max.apply(null, allLats);
        const minLng = Math.min.apply(null, allLngs);
        const maxLng = Math.max.apply(null, allLngs);

        return [
            [minLat, minLng],
            [maxLat, maxLng],
        ];
    }
);

export const getMarkersFetched = state => getFoundMarkers(state) !== null;

export const getMapReferenceTypes = state => getMapSearch(state).referenceTypes;

export const getLocationCountByReferenceType = createSelector(
    [getMapReferenceTypes, getFoundMarkers],
    (referenceTypes, markers) => referenceTypes?.reduce((acc, type) => {
        let numLocations = 0;

        markers?.forEach(marker => {
            const types = marker.ref_types
                .split(',')
                .map(type => Number.parseInt(type));

            if (types.includes(type.id)) {
                numLocations += 1;
            }
        });

        acc[type.id] = numLocations;

        return acc;
    }, {})
);

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

export const getRegistryNameTypesQuery = state => getState(state).registry_name_types.query;

export const getContributionTypesQuery = state => getState(state).contribution_types.query;

export const getCollectionsQuery = state => getState(state).collections.query;

export const getLanguagesQuery = state => getState(state).languages.query;

export const getRolesQuery = state => getState(state).roles.query;

export const getPermissionsQuery = state => getState(state).permissions.query;

export const getTaskTypesQuery = state => getState(state).task_types.query;

export const getUserRegistrationsQuery = state => getState(state).user_registrations.query;

export const getInterviewSearch = state => getState(state).interviews;
