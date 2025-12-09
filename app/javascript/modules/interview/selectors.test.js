import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        autoScroll: true,
    },
};

test('getAutoScroll retrieves auto scroll status', () => {
    expect(selectors.getAutoScroll(state)).toEqual(state[NAME].autoScroll);
});
