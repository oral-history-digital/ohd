import { DISABLE_AUTO_SCROLL, ENABLE_AUTO_SCROLL } from './action-types';

export const initialState = {
    autoScroll: true,
};

const interview = (state = initialState, action) => {
    switch (action.type) {
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
