import { INITIALIZE_MAP_FILTER, TOGGLE_MAP_FILTER } from './action-types';

export const initializeMapFilter = referenceTypeIds => ({
    type: INITIALIZE_MAP_FILTER,
    payload: referenceTypeIds,
});

export const toggleMapFilter = referenceTypeId => ({
    type: TOGGLE_MAP_FILTER,
    payload: referenceTypeId,
});
