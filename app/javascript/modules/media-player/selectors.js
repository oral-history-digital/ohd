import { NAME } from './constants';

const getState = state => state[NAME];

export const getCurrentTape = state => getState(state).tape;

export const getMediaTime = state => getState(state).mediaTime;

export const getIsPlaying = state => getState(state).isPlaying;

export const getResolution = state => getState(state).resolution;

export const getTimeChangeRequest = state => getState(state).timeChangeRequest;

export const getTimeChangeRequestAvailable = state => getTimeChangeRequest(state) !== null;

export const getSticky = state => getState(state).sticky;
