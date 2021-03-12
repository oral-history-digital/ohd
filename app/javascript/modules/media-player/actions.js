import {
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    TIME_CHANGE,
    SET_TAPE,
    SET_RESOLUTION,
    RESET_MEDIA,
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

export const setTape = (tape) => ({
    type: SET_TAPE,
    payload: { tape },
});

export const setResolution = (resolution) => ({
    type: SET_RESOLUTION,
    payload: { resolution },
});

export const resetMedia = () => ({ type: RESET_MEDIA });
