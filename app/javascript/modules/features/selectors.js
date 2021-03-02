import { createSelector } from 'reselect';

import { TREE_SELECT_NAME } from 'modules/tree-select';
import { NAME } from './constants';

const getState = state => state[NAME];

export const getFeatures = createSelector(
    getState,
    state => Object.entries(state)
);

export const getTreeSelectEnabled = state => getState(state)[TREE_SELECT_NAME];
