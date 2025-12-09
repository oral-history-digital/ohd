import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = (state) => state[NAME];

export const getFeatures = createSelector(getState, (state) =>
    Object.entries(state)
);
