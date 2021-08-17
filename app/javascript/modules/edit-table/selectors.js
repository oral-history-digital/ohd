import { NAME } from './constants';

const getState = state => state[NAME];

export const getSkipEmptyRows = state => getState(state).skipEmptyRows;

export const getSelectedColumns = state => getState(state).columns;
