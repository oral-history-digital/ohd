import { HIDE_BANNER } from './action-types';

export const initialState = {
    active: false,
    message_en: '',
    message_de: '',
};

export default function banner(state = initialState, action) {
    switch (action.type) {
        case HIDE_BANNER:
            return {
                ...state,
                active: false,
            };
        default:
            return state;
    }
}
