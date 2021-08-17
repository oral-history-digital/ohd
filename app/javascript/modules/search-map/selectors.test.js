import { NAME  } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        filter: [1,2,3],
    },
};

test('getMapFilter retrieves search map filter', () => {
    expect(selectors.getMapFilter(state)).toEqual(state[NAME].filter);
});
