import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        visible: true,
    },
};

test('getSidebarVisible retrieves flyout tabs visibility', () => {
    expect(selectors.getSidebarVisible(state)).toEqual(state[NAME].visible);
});
