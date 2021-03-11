import {
    TIME_CHANGE,
    SET_NEXT_TAPE,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
} from './action-types';

const initialState = {
    tape: 1,
    mediaTime: 0,
    mediaStatus: 'pause',
    transcriptTime: 0,
    resolution: undefined,
};

const mediaPlayer = (state = initialState, action) => {
    switch (action.type) {
        case TIME_CHANGE:
            return Object.assign({}, state, {
                transcriptTime: action.transcriptTime,
            })
        case SET_NEXT_TAPE:
            return Object.assign({}, state, {
                tape: state.tape + 1,
                mediaTime: 0.1,
                mediaStatus: 'play',
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
        case SET_TAPE_AND_TIME_AND_RESOLUTION:
            return Object.assign({}, state, {
                mediaTime: action.mediaTime,
                transcriptTime: action.transcriptTime,
                tape: action.tape,
                resolution: action.resolution,
                mediaStatus: action.mediaStatus,
            });
        default:
            return state;
    }
};

export default mediaPlayer;
