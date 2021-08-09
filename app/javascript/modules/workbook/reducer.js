import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED,
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
