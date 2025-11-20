import {
    CLEAR_TIME_CHANGE_REQUEST,
    RESET_MEDIA,
    SEND_TIME_CHANGE_REQUEST,
    SET_TAPE,
    UPDATE_IS_PLAYING,
    UPDATE_MEDIA_TIME,
} from './action-types';

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

export const resetMedia = () => ({ type: RESET_MEDIA });

export const sendTimeChangeRequest = (tape, time) => ({
    type: SEND_TIME_CHANGE_REQUEST,
    payload: {
        tape,
        time,
    },
});

export const clearTimeChangeRequest = () => ({
    type: CLEAR_TIME_CHANGE_REQUEST,
});
