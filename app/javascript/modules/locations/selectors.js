import { createSelector } from 'reselect';

import { getArchiveId } from 'modules/archive';

export const getLocations = state => state.locations;

export const getCurrentLocations = state => getLocations(state)?.result;

export const getRegistryReferences = state => getLocations(state)?.entities?.registryReferences;

export const getSegments = state => getLocations(state)?.entities?.segments;

export const getCurrentLocationsWithRefs = createSelector(
    [getCurrentLocations, getRegistryReferences, getSegments],
    (result, registryReferences, segments) => {
        return result.map(referenceId => {
            const reference = registryReferences[referenceId];
            reference.ref_object = segments[reference.ref_object];
            return reference;
        });
    }
);

export const getLocationsFetched = state => {
    const locations = getLocations(state);
    const archiveId = getArchiveId(state);

    return locations.archiveId === archiveId;
};
