import xor from 'lodash.xor';

import { INITIALIZE_MAP_FILTER, TOGGLE_MAP_FILTER } from './action-types';

export const initialState = {
    filter: null,
}

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
        default:
            return state;
    }
};

export default search;
