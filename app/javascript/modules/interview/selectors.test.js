import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        autoScroll: true,
        tabIndex: 2,
    },
};

test('getTabIndex retrieves index of interview tabs', () => {
    expect(selectors.getTabIndex(state)).toEqual(state[NAME].tabIndex);
});

test('getAutoScroll retrieves auto scroll status', () => {
    expect(selectors.getAutoScroll(state)).toEqual(state[NAME].autoScroll);
});
