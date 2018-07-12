import {
    REQUEST_PERSON,
    RECEIVE_PERSON,

    UPDATE_PERSON,
    PEOPLE_URL,
} from '../constants/archiveConstants';

const initialState = {} 

const people = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_PERSON:
            return Object.assign({}, state, {
                isFetchingInterview: true,
                fetchedInterview: false,
            })
        case RECEIVE_PERSON:
            return Object.assign({}, state, {
                isFetchingInterview: false,
                fetchedInterview: true,
                id: action.id,
                interviews: Object.assign({}, state.interviews, {
                    [action.id]: Object.assign({}, state.interviews[action.id], {
                        interview: action.interview,
                    }),
                }),
                lastUpdated: action.receivedAt
            })

        default:
            return state;
    }
};

export default people;
