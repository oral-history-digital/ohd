import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        autoScroll: true,
    },
};

test('getAutoScroll retrieves auto scroll status', () => {
    expect(selectors.getAutoScroll(state)).toEqual(state[NAME].autoScroll);
});
