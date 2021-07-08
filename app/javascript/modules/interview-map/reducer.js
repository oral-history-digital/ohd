import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

export const initialState = {
    locations: null,
    isLoading: false,
    error: null,
};

const locations = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LOCATIONS_STARTED:
            return {
                ...state,
                isLoading: true,
            };
        case FETCH_LOCATIONS_SUCCEEDED:
            return {
                ...state,
                locations: action.payload,
                isLoading: false,
            };
        case FETCH_LOCATIONS_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default locations;
