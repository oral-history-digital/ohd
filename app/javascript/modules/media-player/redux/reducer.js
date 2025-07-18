import {
    UPDATE_MEDIA_TIME,
    UPDATE_IS_PLAYING,
    SET_TAPE,
    RESET_MEDIA,
    SEND_TIME_CHANGE_REQUEST,
    CLEAR_TIME_CHANGE_REQUEST,
    SET_PLAYER_SIZE,
} from './action-types';

export const initialState = {
    tape: 1,
    mediaTime: 0,
    isPlaying: false,
    timeChangeRequest: null,
    playerSize: 'medium',
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
        case SET_PLAYER_SIZE:
            return {
                ...state,
                playerSize: action.payload.size,
            };
        default:
            return state;
    }
};

export default mediaPlayer;
