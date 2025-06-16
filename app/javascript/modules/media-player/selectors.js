import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = state => state[NAME];

export const getCurrentTape = state => getState(state).tape;

export const getMediaTime = state => getState(state).mediaTime;

export const getIsPlaying = state => getState(state).isPlaying;

export const getIsIdle = createSelector(
    [getCurrentTape, getMediaTime, getIsPlaying],
    (tape, time, isPlaying) => {
        return tape === 1 && time === 0 && isPlaying === false;
    }
);

export const getTimeChangeRequest = state => getState(state).timeChangeRequest;

export const getTimeChangeRequestAvailable = state => getTimeChangeRequest(state) !== null;

export const getPlayerSize = state => getState(state).playerSize;
