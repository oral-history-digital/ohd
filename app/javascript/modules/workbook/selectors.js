import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = state => state[NAME];

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

export const getWorkbookError = state => getState(state).error;
