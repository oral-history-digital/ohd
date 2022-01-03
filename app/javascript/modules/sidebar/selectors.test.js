import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        index: 3,
        visible: true,
    },
};

test('getSidebarVisible retrieves flyout tabs visibility', () => {
    expect(selectors.getSidebarVisible(state)).toEqual(state[NAME].visible);
});

test('getSidebarIndex retrieves currently selected tab', () => {
    expect(selectors.getSidebarIndex(state)).toEqual(state[NAME].index);
});
