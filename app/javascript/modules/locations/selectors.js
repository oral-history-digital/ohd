import { createSelector } from 'reselect';

import { getArchiveId } from 'modules/archive';

export const getLocations = state => state.locations;

export const getCurrentLocations = state => {
    const locations = getLocations(state);
    const archiveId = getArchiveId(state);

    return locations[archiveId];
};

export const getCurrentLocationsWithRefs = createSelector(
    [getCurrentLocations],
    currentLocations => currentLocations?.filter(location => (
        location.ref_object &&
        location.latitude &&
        location.longitude
    ))
);

export const getLocationsFetched = state => {
    const locations = getLocations(state);
    const archiveId = getArchiveId(state);

    return Object.prototype.hasOwnProperty.call(locations, archiveId);
};

export const getLocationsLoading = state => getLocations(state).isLoading;

export const getLocationsError = state => getLocations(state).error;
