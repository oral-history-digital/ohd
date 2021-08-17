import * as types from './action-types';
import * as actions from './actions';

test('showFlyoutTabs', () => {
    const actual = actions.showFlyoutTabs();
    const expected = { type: types.SHOW_FLYOUT_TABS };
    expect(actual).toEqual(expected);
});

test('hideFlyoutTabs', () => {
    const actual = actions.hideFlyoutTabs();
    const expected = { type: types.HIDE_FLYOUT_TABS };
    expect(actual).toEqual(expected);
});

test('toggleFlyoutTabs', () => {
    const actual = actions.toggleFlyoutTabs();
    const expected = { type: types.TOGGLE_FLYOUT_TABS };
    expect(actual).toEqual(expected);
});

test('setFlyoutTabsIndex', () => {
    const actual = actions.setFlyoutTabsIndex(5);
    const expected = {
        type: types.SET_FLYOUT_TABS_INDEX,
        index: 5,
    };
    expect(actual).toEqual(expected);
});
