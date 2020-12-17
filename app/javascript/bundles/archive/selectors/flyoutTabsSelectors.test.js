import * as selectors from './flyoutTabsSelectors';

const state = {
    flyoutTabs: {
        index: 3,
        visible: true,
    },
};

test('getFlyoutTabsVisible retrieves flyout tabs visibility', () => {
    expect(selectors.getFlyoutTabsVisible(state)).toEqual(state.flyoutTabs.visible);
});

test('getFlyoutTabsIndex retrieves currently selected tab', () => {
    expect(selectors.getFlyoutTabsIndex(state)).toEqual(state.flyoutTabs.index);
});
