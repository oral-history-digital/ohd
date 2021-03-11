import { TRANSCRIPT_SCROLL, SET_INTERVIEW_TAB_INDEX } from './action-types';

export const initialState = {
    transcriptScrollEnabled: false,
    tabIndex: 0,
};

const interview = (state = initialState, action) => {
    switch (action.type) {
        case SET_INTERVIEW_TAB_INDEX:
            return Object.assign({}, state, {
                tabIndex: action.tabIndex
            })
        case TRANSCRIPT_SCROLL:
            return Object.assign({}, state, {
                transcriptScrollEnabled: action.transcriptScrollEnabled
            })
        default:
            return state;
    }
};

export default interview;
