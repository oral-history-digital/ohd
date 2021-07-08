import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

export const initialState = {
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
                [action.payload.archive_id]: action.payload.segment_ref_locations,
                isLoading: false,
                error: null,
            };
        case FETCH_LOCATIONS_FAILED:
            return {
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default locations;
