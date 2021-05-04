import {
    UPDATE_MEDIA_TIME,
    UPDATE_IS_PLAYING,
    SET_TAPE,
    SET_RESOLUTION,
    RESET_MEDIA,
    SEND_TIME_CHANGE_REQUEST,
    CLEAR_TIME_CHANGE_REQUEST,
    SET_STICKY,
    UNSET_STICKY,
} from './action-types';

export const initialState = {
    tape: 1,
    mediaTime: 0,
    isPlaying: false,
    resolution: null,
    timeChangeRequest: null,
    sticky: false,
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
        case SET_RESOLUTION:
            return {
                ...state,
                resolution: action.payload.resolution,
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
        case SET_STICKY:
            return {
                ...state,
                sticky: true,
            };
        case UNSET_STICKY:
            return {
                ...state,
                sticky: false,
            };
        default:
            return state;
    }
};

export default mediaPlayer;
