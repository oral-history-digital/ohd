import { getFlyoutTabsVisible, getFlyoutTabsIndex } from './flyoutTabsSelectors';

const state = {
    flyoutTabs: {
        index: 3,
        visible: true,
    },
};

test('getFlyoutTabsVisible retrieves flyout tabs visibility from state', () => {
    expect(getFlyoutTabsVisible(state)).toBe(true);
});

test('getFlyoutTabsIndex retrieves currently selected tab', () => {
    expect(getFlyoutTabsIndex(state)).toBe(3);
});
