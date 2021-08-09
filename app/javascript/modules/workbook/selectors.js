import { NAME } from './constants';

const getState = state => state[NAME];

export const getWorkbookIsLoading = state => getState(state).isLoading;

export const getWorkbookData = state => getState(state).data;

export const getWorkbookError = state => getState(state).error;
