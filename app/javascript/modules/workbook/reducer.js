import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED
} from './action-types';

export const initialState = {
    isLoading: false,
    error: null,
};

const workbook = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_WORKBOOK_STARTED:
            return {
                isLoading: true,
                error: null,
            };
        case FETCH_WORKBOOK_SUCCEEDED:
            return {
                ...state,
                data: action.payload.data,
                isLoading: false,
            };
        case FETCH_WORKBOOK_FAILED:
            return {
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default workbook;
