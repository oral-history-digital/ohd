import {
    CLEAR_TIME_CHANGE_REQUEST,
    RESET_MEDIA,
    SEND_TIME_CHANGE_REQUEST,
    SET_TAPE,
    UPDATE_IS_PLAYING,
    UPDATE_MEDIA_TIME,
} from './action-types';

export const initialState = {
    tape: 1,
    mediaTime: 0,
    isPlaying: false,
    timeChangeRequest: null,
};

const mediaPlayer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_MEDIA_TIME:
            return {
                ...state,
                mediaTime: action.payload.time,
            };
        case UPDATE_IS_PLAYING:
            return {
                ...state,
                isPlaying: action.payload.isPlaying,
            };
        case SET_TAPE:
            return {
                ...state,
                tape: action.payload.tape,
            };
        case RESET_MEDIA:
            return initialState;
        case SEND_TIME_CHANGE_REQUEST:
            return {
                ...state,
                tape: action.payload.tape,
                timeChangeRequest: action.payload.time,
            };
        case CLEAR_TIME_CHANGE_REQUEST:
            return {
                ...state,
                timeChangeRequest: null,
            };
        default:
            return state;
    }
};

export default mediaPlayer;
