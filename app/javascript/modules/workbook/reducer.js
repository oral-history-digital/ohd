import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED,
    CREATE_WORKBOOK_SUCCEEDED,
    DELETE_WORKBOOK_SUCCEEDED,
} from './action-types';

export const initialState = {
    isLoading: false,
    error: null,
};

const workbook = (state = initialState, action) => {
    let nextData;
    switch (action.type) {
        case FETCH_WORKBOOK_STARTED:
            return {
                isLoading: true,
                error: null,
            };
        case FETCH_WORKBOOK_SUCCEEDED:
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
                userAccountId: action.payload.user_account_id,
            };
        case FETCH_WORKBOOK_FAILED:
            return {
                isLoading: false,
                error: action.error,
            };
        case CREATE_WORKBOOK_SUCCEEDED:
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.id]: action.payload.data,
                },
            };
        case DELETE_WORKBOOK_SUCCEEDED:
            nextData = {
                ...state.data,
            };
            delete nextData[action.payload.id];
            return {
                ...state,
                data: nextData,
            };
        default:
            return state;
    }
};

export default workbook;
