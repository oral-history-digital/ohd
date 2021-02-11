import { NAME } from './constants';

const getState = state => state[NAME];

export const getCurrentTape = state => getState(state).tape;

export const getVideoTime = state => getState(state).videoTime;

export const getVideoStatus = state => getState(state).videoStatus;

export const getTranscriptTime = state => getState(state).transcriptTime;

export const getTranscriptScrollEnabled = state => getState(state).transcriptScrollEnabled;

export const getVideoResolution = state => getState(state).resolution;

export const getTabIndex = state => getState(state).tabIndex;
