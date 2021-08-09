import { createSelector } from 'reselect';

import { getCurrentAccount } from 'modules/data';
import { NAME } from './constants';

const getState = state => state[NAME];

export const getWorkbookIsLoading = state => getState(state).isLoading;

export const getWorkbookData = state => getState(state).data;

export const getWorkbookAccountId = state => getState(state).userAccountId;

export const getWorkbookLoaded = createSelector(
    [getWorkbookData, getWorkbookAccountId, getCurrentAccount],
    (data, workbookAccountId, account) => {
        return (data !== null) && (typeof data !== 'undefined') && (workbookAccountId === account.id);
    }
);

export const getWorkbookError = state => getState(state).error;
