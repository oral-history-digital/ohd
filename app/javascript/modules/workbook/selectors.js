import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = state => state[NAME];

export const getWorkbookIsLoading = state => getState(state).isLoading;

export const getWorkbookData = state => getState(state).data;

export const getSortedWorkbookData = createSelector(
    getWorkbookData,
    data => {
        if (!data) {
            return null;
        }

        return Object.values(data)
            .sort((a, b) => {
                const aDate = new Date(a.created_at);
                const bDate = new Date(b.created_at);
                return bDate - aDate;
            });
    }
);

export const getWorkbookAnnotations = createSelector(
    getSortedWorkbookData,
    data => data?.filter(item => item.type === 'UserAnnotation') || null,
);

export const getWorkbookSearches = createSelector(
    getSortedWorkbookData,
    data => data?.filter(item => item.type === 'Search') || null,
);

export const getWorkbookInterviews = createSelector(
    getSortedWorkbookData,
    data => data?.filter(item => item.type === 'InterviewReference') || null,
);

export const getWorkbookLoaded = createSelector(
    [getWorkbookData],
    data => {
        return (data !== null) && (typeof data !== 'undefined');
    }
);

export const getWorkbookError = state => getState(state).error;
