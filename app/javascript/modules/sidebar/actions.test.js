import * as types from './action-types';
import * as actions from './actions';

test('showSidebar', () => {
    const actual = actions.showSidebar();
    const expected = { type: types.SHOW_SIDEBAR };
    expect(actual).toEqual(expected);
});

test('hideSidebar', () => {
    const actual = actions.hideSidebar();
    const expected = { type: types.HIDE_SIDEBAR };
    expect(actual).toEqual(expected);
});

test('toggleSidebar', () => {
    const actual = actions.toggleSidebar();
    const expected = { type: types.TOGGLE_SIDEBAR };
    expect(actual).toEqual(expected);
});

test('setSidebarTabsIndex', () => {
    const actual = actions.setSidebarTabsIndex(5);
    const expected = {
        type: types.SET_SIDEBAR_TABS_INDEX,
        index: 5,
    };
    expect(actual).toEqual(expected);
});
