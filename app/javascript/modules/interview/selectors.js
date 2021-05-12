import { NAME } from './constants';

const getState = state => state[NAME];

export const getTabIndex = state => getState(state).tabIndex;

export const getAutoScroll = state => getState(state).autoScroll;
