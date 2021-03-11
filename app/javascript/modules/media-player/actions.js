import {
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    TIME_CHANGE,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
    SET_NEXT_TAPE,
} from './action-types';

export function handleSegmentClick(tape, time) {
    return {
        type: TRANSCRIPT_TIME_CHANGE,
        mediaTime: time,
        tape: tape,
    }
}

export function setTapeAndTime(tape, time) {
    return {
        type: SET_TAPE_AND_TIME,
        mediaTime: time,
        transcriptTime: time,
        tape: tape
    }
}

export function handleTimeChange(time) {
    return {
        type: TIME_CHANGE,
        transcriptTime: time
    }
  }

export function setTapeAndTimeAndResolution(tape, time, resolution, mediaStatus = 'pause') {
    return {
        type: SET_TAPE_AND_TIME_AND_RESOLUTION,
        mediaTime: time,
        transcriptTime: time,
        tape,
        resolution,
        mediaStatus,
    }
}

export function setNextTape() {
    return {
        type: SET_NEXT_TAPE,
    }
}
