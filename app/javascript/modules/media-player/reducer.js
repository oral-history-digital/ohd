import {
    UPDATE_MEDIA_TIME,
    UPDATE_IS_PLAYING,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    SET_TAPE,
    SET_RESOLUTION,
    RESET_MEDIA,
} from './action-types';

export const initialState = {
    tape: 1,
    mediaTime: 0,
    isPlaying: false,
    resolution: null,
};

const mediaPlayer = (state = initialState, action) => {
    switch (action.type) {
        case TRANSCRIPT_TIME_CHANGE:
            return Object.assign({}, state, {
                mediaTime: action.mediaTime,
                tape: action.tape,
            })
        case SET_TAPE_AND_TIME:
            return Object.assign({}, state, {
                mediaTime: action.mediaTime,
                tape: action.tape,
            })
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
        default:
            return state;
    }
};

export default mediaPlayer;
