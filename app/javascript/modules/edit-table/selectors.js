import { NAME } from './constants';

const getState = (state) => state[NAME];

export const getFilter = (state) => getState(state).filter;

export const getSelectedColumns = (state) => getState(state).columns;
