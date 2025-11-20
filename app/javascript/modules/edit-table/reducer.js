import { SET_FILTER, SET_COLUMNS } from './action-types';
import { EDIT_TABLE_FILTER_ALL } from './constants';

export const initialState = {
    filter: EDIT_TABLE_FILTER_ALL,
    columns: [
        'timecode',
        'text_orig',
        'text_translated',
        'mainheading_orig',
        'subheading_orig',
        'registry_references',
        'annotations',
    ],
};

const editTable = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload,
            };
        case SET_COLUMNS:
            return {
                ...state,
                columns: action.payload,
            };
        default:
            return state;
    }
};

export default editTable;
