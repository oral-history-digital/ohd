import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        index: 3,
        visible: true,
    },
};

test('getFlyoutTabsVisible retrieves flyout tabs visibility', () => {
    expect(selectors.getFlyoutTabsVisible(state)).toEqual(state[NAME].visible);
});

test('getFlyoutTabsIndex retrieves currently selected tab', () => {
    expect(selectors.getFlyoutTabsIndex(state)).toEqual(state[NAME].index);
});
