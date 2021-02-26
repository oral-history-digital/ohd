import { TREE_SELECT_NAME } from 'modules/tree-select';
import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        [TREE_SELECT_NAME]: true,
    },
};

test('getFeatures retrieves all features at once', () => {
    expect(selectors.getFeatures(state)).toEqual([
        [TREE_SELECT_NAME, true],
    ]);
});

test('getTreeSelectEnabled retrieves tree select feature status', () => {
    expect(selectors.getTreeSelectEnabled(state)).toEqual(state[NAME][TREE_SELECT_NAME]);
});
