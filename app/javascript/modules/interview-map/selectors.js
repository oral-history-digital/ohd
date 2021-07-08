import { createSelector } from 'reselect';

import { NAME } from './constants';

export const getInterviewMap = state => state[NAME];

export const getInterviewMapLocations = state => getInterviewMap(state).locations;

export const getInterviewMapLoading = state => getInterviewMap(state).isLoading;

export const getInterviewMapError = state => getInterviewMap(state).error;

export const getInterviewMapMarkers = createSelector(
    [getInterviewMapLocations],
    locations => {
        if (!locations) {
            return null;
        }

        const markers = locations.map(location => ({
            id: location.id,
            lat: Number.parseFloat(location.lat),
            long: Number.parseFloat(location.lon),
            name: location.name,
            numReferences: location.ref_types.split(',').length,
            radius: 7.5,
            color: 'red',
        }));

        return markers;
    }
);
