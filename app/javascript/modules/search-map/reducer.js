import xor from 'lodash.xor';

import {
    INITIALIZE_MAP_FILTER,
    SET_MAP_VIEW,
    TOGGLE_MAP_FILTER,
} from './action-types';

export const initialState = {
    filter: null,
    mapView: null,
};

const search = (state = initialState, action) => {
    switch (action.type) {
        case INITIALIZE_MAP_FILTER:
            return {
                ...state,
                filter: action.payload,
            };
        case TOGGLE_MAP_FILTER:
            return {
                ...state,
                filter: xor(state.filter, [action.payload]),
            };
        case SET_MAP_VIEW:
            return {
                ...state,
                mapView: action.payload,
            };
        default:
            return state;
    }
};

export default search;
