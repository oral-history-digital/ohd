import {
    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,
    SET_NEXT_TAPE,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
} from './action-types';

const initialState = {
    tape: 1,
    videoTime: 0,
    videoStatus: 'pause',
    transcriptTime: 0,
    resolution: undefined,
}

const mediaPlayer = (state = initialState, action) => {
    switch (action.type) {
        case VIDEO_TIME_CHANGE:
            return Object.assign({}, state, {
                transcriptTime: action.transcriptTime,
            })
        case VIDEO_ENDED:
            return Object.assign({}, state, {
                videoStatus: 'paused',
                videoTime: 0,
                transcriptTime: 0,
            })
        case SET_NEXT_TAPE:
            return Object.assign({}, state, {
                tape: state.tape + 1,
                videoTime: 0.1,
                videoStatus: 'play',
            })
        case TRANSCRIPT_TIME_CHANGE:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                videoStatus: 'play',
                transcriptTime: action.videoTime,
                tape: action.tape,
            })
        case SET_TAPE_AND_TIME:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                transcriptTime: action.transcriptTime,
                tape: action.tape,
            })
        case SET_TAPE_AND_TIME_AND_RESOLUTION:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                transcriptTime: action.transcriptTime,
                tape: action.tape,
                resolution: action.resolution,
                videoStatus: action.videoStatus,
            });
        default:
            return state;
    }
};

export default mediaPlayer;
