import { NAME } from './constants';

const getState = state => state[NAME];

export const getTranscriptScrollEnabled = state => getState(state).transcriptScrollEnabled;

export const getTabIndex = state => getState(state).tabIndex;
