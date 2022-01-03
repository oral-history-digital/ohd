import { SHOW_SIDEBAR, HIDE_SIDEBAR, TOGGLE_SIDEBAR, SET_SIDEBAR_TABS_INDEX }
    from './action-types';
import { INDEX_ACCOUNT } from './constants';

export const initialState = {
    visible: false,
    index: INDEX_ACCOUNT,
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
        case SET_SIDEBAR_TABS_INDEX:
            return {
                ...state,
                index: action.index,
            };
        default:
            return state;
    }
}
