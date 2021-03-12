import {
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    UPDATE_MEDIA_TIME,
    UPDATE_IS_PLAYING,
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
        tape: tape
    }
}

export const updateMediaTime = (time) => ({
    type: UPDATE_MEDIA_TIME,
    payload: { time },
});

export const updateIsPlaying = (isPlaying) => ({
    type: UPDATE_IS_PLAYING,
    payload: { isPlaying },
});

export const setTape = (tape) => ({
    type: SET_TAPE,
    payload: { tape },
});

export const setResolution = (resolution) => ({
    type: SET_RESOLUTION,
    payload: { resolution },
});

export const resetMedia = () => ({ type: RESET_MEDIA });
