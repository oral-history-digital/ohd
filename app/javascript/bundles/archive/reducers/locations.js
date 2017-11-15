import { 
    REQUEST_LOCATIONS,
    RECEIVE_LOCATIONS,
    LOCATIONS_URL,
} from '../constants/archiveConstants';

const locations = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_LOCATIONS:
            return Object.assign({}, state, {
                isFetchingLocations: true,
            })
        case RECEIVE_LOCATIONS:
            return Object.assign({}, state, {
                isFetchingLocations: false,
                [action.archiveId]: action.segmentRefLocations,
                lastUpdated: action.receivedAt
            })

        default:
            return state;
    }
};

export default locations;
