import {
    SET_SKIP_EMPTY_ROWS,
    SET_COLUMNS,
} from './action-types';

export const initialState = {
    skipEmptyRows: false,
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
        case SET_SKIP_EMPTY_ROWS:
            return {
                ...state,
                skipEmptyRows: action.payload,
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
