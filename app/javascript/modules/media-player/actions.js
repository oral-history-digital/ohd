import {
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
    SET_NEXT_TAPE,
} from './action-types';

export function handleSegmentClick(tape, time) {
    return {
        type: TRANSCRIPT_TIME_CHANGE,
        videoTime: time,
        tape: tape,
    }
}

export function setTapeAndTime(tape, time) {
    return {
        type: SET_TAPE_AND_TIME,
        videoTime: time,
        transcriptTime: time,
        tape: tape
    }
}

export function handleVideoTimeChange(time) {
    return {
        type: VIDEO_TIME_CHANGE,
        transcriptTime: time
    }
  }

export function handleVideoEnded() {
    return {
        type: VIDEO_ENDED,
    }
}

export function setTapeAndTimeAndResolution(tape, time, resolution, videoStatus = 'pause') {
    return {
        type: SET_TAPE_AND_TIME_AND_RESOLUTION,
        videoTime: time,
        transcriptTime: time,
        tape,
        resolution,
        videoStatus,
    }
}

export function setNextTape() {
    return {
        type: SET_NEXT_TAPE,
    }
}
