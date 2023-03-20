import { LOGOUT } from 'modules/user';

import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED,
    CREATE_WORKBOOK_SUCCEEDED,
    UPDATE_WORKBOOK_SUCCEEDED,
    DELETE_WORKBOOK_SUCCEEDED,
} from './action-types';

export const initialState = {
    isLoading: false,
    data: null,
    error: null,
};

const workbook = (state = initialState, action) => {
    let nextData;
    switch (action.type) {
        case FETCH_WORKBOOK_STARTED:
            return {
                isLoading: true,
                data: null,
                error: null,
            };
        case FETCH_WORKBOOK_SUCCEEDED:
            return {
                ...state,
                isLoading: false,
                data: action.payload.data,
            };
        case FETCH_WORKBOOK_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };
        case CREATE_WORKBOOK_SUCCEEDED:
        case UPDATE_WORKBOOK_SUCCEEDED:
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
        case LOGOUT:
            return {
                ...state,
                data: null,
            };
        default:
            return state;
    }
};

export default workbook;
