import {
    INITIALIZE_MAP_FILTER,
    SET_MAP_VIEW,
    TOGGLE_MAP_FILTER,
} from './action-types';

export const initializeMapFilter = (referenceTypeIds) => ({
    type: INITIALIZE_MAP_FILTER,
    payload: referenceTypeIds,
});

export const toggleMapFilter = (referenceTypeId) => ({
    type: TOGGLE_MAP_FILTER,
    payload: referenceTypeId,
});

export const setMapView = (mapView) => ({
    type: SET_MAP_VIEW,
    payload: mapView,
});
