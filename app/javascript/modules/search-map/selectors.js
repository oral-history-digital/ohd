import { NAME } from './constants';

const getState = state => state[NAME];

export const getMapFilter = state => getState(state).filter;
