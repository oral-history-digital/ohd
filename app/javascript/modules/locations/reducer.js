import { REQUEST_LOCATIONS, RECEIVE_LOCATIONS } from './action-types';

const locations = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_LOCATIONS:
            return {
                ...state,
                isFetchingLocations: true,
            };
        case RECEIVE_LOCATIONS:
            return {
                ...state,
                isFetchingLocations: false,
                archiveId: action.payload.archiveId,
                result: action.payload.result,
                entities: action.payload.entities,
            };
        default:
            return state;
    }
};

export default locations;
