import { SHOW_SIDEBAR, HIDE_SIDEBAR, TOGGLE_SIDEBAR } from './action-types';
import { INDEX_NONE } from './constants';

export const initialState = {
    visible: false,
    index: INDEX_NONE,
};

export default function sidebar(state = initialState, action) {
    switch (action.type) {
        case SHOW_SIDEBAR:
            return {
                ...state,
                visible: true,
            };
        case HIDE_SIDEBAR:
            return {
                ...state,
                visible: false,
            };
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                visible: !state.visible,
            };
        default:
            return state;
    }
}
