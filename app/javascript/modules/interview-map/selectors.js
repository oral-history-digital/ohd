import { createSelector } from 'reselect';

import { getArchiveId } from 'modules/archive';
import { NAME } from './constants';

export const getInterviewMap = state => state[NAME];

export const getCurrentLocations = state => {
    const locations = getInterviewMap(state);
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

export const getInterviewMapFetched = state => {
    const locations = getInterviewMap(state);
    const archiveId = getArchiveId(state);

    return Object.prototype.hasOwnProperty.call(locations, archiveId);
};

export const getInterviewMapLoading = state => getInterviewMap(state).isLoading;

export const getInterviewMapError = state => getInterviewMap(state).error;
