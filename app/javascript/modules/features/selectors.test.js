import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        'dummy-feature': true,
    },
};

test('getFeatures retrieves all features at once', () => {
    expect(selectors.getFeatures(state)).toEqual([['dummy-feature', true]]);
});
