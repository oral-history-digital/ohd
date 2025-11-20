import { NAME } from './constants';

const getState = (state) => state[NAME];

export const getAutoScroll = (state) => getState(state).autoScroll;
