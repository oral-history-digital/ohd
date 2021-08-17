import { SET_INTERVIEW_TAB_INDEX, ENABLE_AUTO_SCROLL, DISABLE_AUTO_SCROLL } from './action-types';

export const initialState = {
    autoScroll: true,
    tabIndex: 0,
};

const interview = (state = initialState, action) => {
    switch (action.type) {
        case SET_INTERVIEW_TAB_INDEX:
            return {
                ...state,
                tabIndex: action.tabIndex,
            };
        case ENABLE_AUTO_SCROLL:
            return {
                ...state,
                autoScroll: true,
            };
        case DISABLE_AUTO_SCROLL:
            return {
                ...state,
                autoScroll: false,
            };
        default:
            return state;
    }
};

export default interview;
