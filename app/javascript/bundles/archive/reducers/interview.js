import {
    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,
    SET_NEXT_TAPE,
    TRANSCRIPT_SCROLL,
    SET_INTERVIEW_TAB_INDEX,

    TRANSCRIPT_TIME_CHANGE,

    SET_TAPE_AND_TIME,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
    SET_ACTUAL_SEGMENT,
} from '../constants/archiveConstants';

const initialState = {
    tape: 1,
    videoTime: 0,
    videoStatus: 'pause',
    transcriptTime: 0,
    transcriptScrollEnabled: false,
    resolution: undefined,
}


const interview = (state = initialState, action) => {
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
                tabIndex: action.tabIndex || state.tabIndex,
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
            })
        case SET_INTERVIEW_TAB_INDEX:
            return Object.assign({}, state, {
                tabIndex: action.tabIndex
            })
        case SET_ACTUAL_SEGMENT:
            return Object.assign({}, state, {
                currentSegment: action.segment
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