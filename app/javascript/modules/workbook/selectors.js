import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = state => state[NAME];

export const getWorkbookIsLoading = state => getState(state).isLoading;

export const getWorkbookData = state => getState(state).data;

export const getWorkbookAnnotations = createSelector(
    getWorkbookData,
    data => {
        if (!data) {
            return null;
        }

        return Object.values(data)
            .filter(datum => datum.type === 'UserAnnotation');
    }
);

export const getWorkbookSearches = createSelector(
    getWorkbookData,
    data => {
        if (!data) {
            return null;
        }

        return Object.values(data)
            .filter(datum => datum.type === 'Search');
    }
);

export const getWorkbookInterviews = createSelector(
    getWorkbookData,
    data => {
        if (!data) {
            return null;
        }

        return Object.values(data)
            .filter(datum => datum.type === 'InterviewReference');
    }
);

export const getWorkbookLoaded = createSelector(
    [getWorkbookData],
    data => {
        return (data !== null) && (typeof data !== 'undefined');
    }
);

export const getWorkbookError = state => getState(state).error;
