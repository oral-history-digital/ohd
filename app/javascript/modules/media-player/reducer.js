import {
    TIME_CHANGE,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    SET_TAPE,
    SET_RESOLUTION,
    RESET_MEDIA,
} from './action-types';

export const initialState = {
    tape: 1,
    mediaTime: 0,
    mediaStatus: 'pause',
    transcriptTime: 0,
    resolution: null,
};

const mediaPlayer = (state = initialState, action) => {
    switch (action.type) {
        case TIME_CHANGE:
            return Object.assign({}, state, {
                transcriptTime: action.transcriptTime,
            })
        case TRANSCRIPT_TIME_CHANGE:
            return Object.assign({}, state, {
                mediaTime: action.mediaTime,
                mediaStatus: 'play',
                transcriptTime: action.mediaTime,
                tape: action.tape,
            })
        case SET_TAPE_AND_TIME:
            return Object.assign({}, state, {
                mediaTime: action.mediaTime,
                transcriptTime: action.transcriptTime,
                tape: action.tape,
            })
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
