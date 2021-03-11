import { NAME } from './constants';

const getState = state => state[NAME];

export const getCurrentTape = state => getState(state).tape;

export const getMediaTime = state => getState(state).mediaTime;

export const getMediaStatus = state => getState(state).mediaStatus;

export const getTranscriptTime = state => getState(state).transcriptTime;

export const getResolution = state => getState(state).resolution;
